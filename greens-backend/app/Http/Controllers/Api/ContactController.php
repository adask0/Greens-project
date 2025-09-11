<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string|max:2000',
            'g-recaptcha-response' => 'required'
        ], [
            'name.required' => 'Imię jest wymagane.',
            'email.required' => 'Adres email jest wymagany.',
            'email.email' => 'Podaj prawidłowy adres email.',
            'message.required' => 'Wiadomość jest wymagana.',
            'g-recaptcha-response.required' => 'Proszę potwierdzić captchę.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Błędne dane',
                'messages' => $validator->errors()
            ], 422);
        }

        // Weryfikacja reCAPTCHA
        $recaptchaSecret = env('RECAPTCHA_SECRET_KEY');
        if ($recaptchaSecret) {
            $recaptchaResponse = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret' => $recaptchaSecret,
                'response' => $request->input('g-recaptcha-response'),
                'remoteip' => $request->ip()
            ]);

            $recaptchaData = $recaptchaResponse->json();

            if (!$recaptchaData['success']) {
                return response()->json([
                    'error' => 'Weryfikacja captchy nie powiodła się. Spróbuj ponownie.'
                ], 422);
            }
        }

        try {
            // Zapisz wiadomość w bazie danych (opcjonalne)
            $contact = \DB::table('contact_message')->insert([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'message' => $request->message,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'status' => 'new',
                'created_at' => now(),
                'updated_at' => now()
            ]);

            // Wyślij email do administratora
            $this->sendEmailToAdmin($request->all());

            // Wyślij email potwierdzający do nadawcy
            $this->sendConfirmationEmail($request->all());

            return response()->json([
                'message' => 'Wiadomość została wysłana pomyślnie!'
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Błąd wysyłania formularza kontaktowego: ' . $e->getMessage());

            return response()->json([
                'error' => 'Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie później.'
            ], 500);
        }
    }

    private function sendEmailToAdmin($data)
    {
        $adminEmail = 'greenspolska@gmail.com';

        Mail::send('emails.contact-admin', ['data' => $data], function ($message) use ($adminEmail, $data) {
            $message->from(config('mail.from.address'), config('mail.from.name'))
                ->to($adminEmail)
                ->subject('Nowa wiadomość z formularza kontaktowego - ' . $data['name'])
                ->replyTo($data['email'], $data['name']);
        });
    }

    private function sendConfirmationEmail($data)
    {
        Mail::send('emails.contact-confirmation', ['data' => $data], function ($message) use ($data) {
            $message->from(config('mail.from.address'), config('mail.from.name'))
                ->to($data['email'], $data['name'])
                ->subject('Potwierdzenie otrzymania wiadomości - Greens');
        });
    }

    public function index()
    {
        $contacts = Contact::orderBy('created_at', 'desc')->paginate(20);
        return response()->json($contacts);
    }

    public function show($id)
    {
        $contact = Contact::findOrFail($id);
        return response()->json($contact);
    }

    public function updateStatus(Request $request, $id)
    {
        $contact = Contact::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:new,read,replied,closed'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $contact->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Status został zaktualizowany.',
            'contact' => $contact
        ]);
    }
}
