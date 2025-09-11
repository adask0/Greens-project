<!DOCTYPE html>
<html lang="pl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nowa wiadomość z formularza kontaktowego</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }

        .container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
        }

        .content {
            padding: 30px;
        }

        .contact-info {
            background-color: #f9f9f9;
            border-left: 4px solid #4CAF50;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }

        .contact-info h3 {
            margin-top: 0;
            color: #333;
        }

        .contact-info p {
            margin: 10px 0;
        }

        .message-box {
            background-color: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            padding: 20px;
            margin: 20px 0;
        }

        .message-box h3 {
            margin-top: 0;
            color: #333;
        }

        .footer {
            background-color: #f9f9f9;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #e0e0e0;
        }

        .btn {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin: 10px 0;
        }

        .meta-info {
            font-size: 11px;
            color: #888;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Greens - Nowa wiadomość</h1>
            <p>Otrzymałeś nową wiadomość z formularza kontaktowego</p>
        </div>

        <div class="content">
            <div class="contact-info">
                <h3>📋 Dane kontaktowe</h3>
                <p><strong>👤 Imię:</strong> {{ $data['name'] }}</p>
                <p><strong>✉️ Email:</strong> {{ $data['email'] }}</p>
                @if(!empty($data['phone']))
                    <p><strong>📞 Telefon:</strong> {{ $data['phone'] }}</p>
                @endif
            </div>

            <div class="message-box">
                <h3>💬 Treść wiadomości</h3>
                <p style="white-space: pre-line; line-height: 1.6;">{{ $data['message'] }}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <a href="mailto:{{ $data['email'] }}?subject=Re: Kontakt przez stronę Greens" class="btn">
                    📧 Odpowiedz na email
                </a>
            </div>

            <div class="meta-info">
                <p><strong>📅 Data wysłania:</strong> {{ now()->format('d.m.Y H:i:s') }}</p>
                <p><strong>🌐 IP nadawcy:</strong> {{ request()->ip() }}</p>
                <p><strong>💻 Przeglądarka:</strong> {{ request()->userAgent() }}</p>
            </div>
        </div>

        <div class="footer">
            <p><strong>Greens</strong> - Twoje miejsce, nasze zadanie</p>
            <p>Ta wiadomość została wysłana automatycznie z formularza kontaktowego na stronie.</p>
            <p>Email: greenspolska@gmail.com</p>
        </div>
    </div>
</body>

</html>
