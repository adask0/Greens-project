<!DOCTYPE html>
<html lang="pl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resetowanie hasła</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            margin-top: 20px;
        }

        .header {
            text-align: center;
            background-color: #45964d;
            color: white;
            padding: 20px;
            border-radius: 10px 10px 0 0;
            margin: -20px -20px 30px -20px;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
        }

        .content {
            padding: 0 20px;
        }

        .button {
            display: inline-block;
            background-color: #f97316;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
        }

        .button:hover {
            background-color: #ea580c;
        }

        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
            text-align: center;
        }

        .warning {
            background-color: #fef3c7;
            color: #92400e;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #f59e0b;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Resetowanie hasła</h1>
        </div>

        <div class="content">
            <p>Cześć!</p>

            <p>Otrzymaliśmy prośbę o zresetowanie hasła dla konta powiązanego z adresem e-mail:
                <strong>{{ $email }}</strong></p>

            <p>Aby zresetować swoje hasło, kliknij poniższy przycisk:</p>

            <div style="text-align: center;">
                <a href="{{ $resetUrl }}" class="button">Zresetuj hasło</a>
            </div>

            <div class="warning">
                ⚠️ <strong>Ważne:</strong> Ten link będzie aktywny przez 60 minut. Jeśli nie zresetujesz hasła w tym
                czasie, będziesz musiał ponownie poprosić o link resetujący.
            </div>

            <p>Jeśli nie prosiłeś o zresetowanie hasła, zignoruj tę wiadomość. Twoje hasło pozostanie bez zmian.</p>

            <p>Pozdrawiamy,<br>
                Zespół Twojej Aplikacji</p>
        </div>

        <div class="footer">
            <p>Ta wiadomość została wysłana automatycznie. Prosimy nie odpowiadać na ten e-mail.</p>
            <p>© {{ date('Y') }} Twoja Aplikacja. Wszystkie prawa zastrzeżone.</p>
        </div>
    </div>
</body>

</html>
