<!DOCTYPE html>
<html lang="pl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Potwierdzenie otrzymania wiadomości - Greens</title>
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

        .success-icon {
            text-align: center;
            font-size: 48px;
            margin: 20px 0;
        }

        .message-summary {
            background-color: #f9f9f9;
            border-left: 4px solid #4CAF50;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }

        .footer {
            background-color: #f9f9f9;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #e0e0e0;
        }

        .contact-info {
            background-color: #e8f5e8;
            padding: 20px;
            border-radius: 4px;
            margin: 20px 0;
        }

        .highlight {
            color: #4CAF50;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>✅ Dziękujemy za kontakt!</h1>
            <p>Otrzymaliśmy Twoją wiadomość</p>
        </div>

        <div class="content">
            <div class="success-icon">
                🎉
            </div>

            <p>Witaj <strong>{{ $data['name'] }}</strong>,</p>

            <p>Dziękujemy za skontaktowanie się z nami! Twoja wiadomość została <span class="highlight">pomyślnie
                    dostarczona</span> i zostanie przejrzana przez nasz zespół.</p>

            <div class="message-summary">
                <h4>📋 Podsumowanie Twojej wiadomości:</h4>
                <p><strong>Data wysłania:</strong> {{ now()->format('d.m.Y H:i') }}</p>
                <p><strong>Temat:</strong> Kontakt przez formularz</p>
                <div style="margin-top: 15px;">
                    <strong>Treść wiadomości:</strong>
                    <div
                        style="background: white; padding: 15px; margin-top: 10px; border-radius: 4px; font-style: italic;">
                        "{{ Str::limit($data['message'], 200, '...') }}"
                    </div>
                </div>
            </div>

            <div class="contact-info">
                <h4>⏰ Co dalej?</h4>
                <ul style="padding-left: 20px;">
                    <li>Nasz zespół przejrzy Twoją wiadomość w ciągu <strong>24 godzin</strong></li>
                    <li>Skontaktujemy się z Tobą emailem lub telefonicznie (jeśli podałeś numer)</li>
                    <li>W razie pilnych spraw możesz dzwonić bezpośrednio</li>
                </ul>
            </div>

            <p>Jeśli masz dodatkowe pytania, nie wahaj się z nami skontaktować!</p>

            <div class="contact-info">
                <h4>📞 Nasze dane kontaktowe:</h4>
                <p><strong>Email:</strong> greenspolska@gmail.com</p>
                <p><strong>Wsparcie:</strong> Dostępne 24/7</p>
                <p><strong>Strona:</strong> www.greens.pl</p>
            </div>
        </div>

        <div class="footer">
            <p><strong>Greens</strong> - Twoje miejsce, nasze zadanie</p>
            <p>Łączymy specjalistów z klientami 24/7. Usługi od A do Z dla firm i osób fizycznych.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;">
            <p style="font-size: 11px; color: #888;">
                Ta wiadomość została wysłana automatycznie w odpowiedzi na Twój formularz kontaktowy.<br>
                Prosimy nie odpowiadać na ten email - w razie pytań skorzystaj z naszych danych kontaktowych powyżej.
            </p>
        </div>
    </div>
</body>

</html>
