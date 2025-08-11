-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 11, 2025 at 03:54 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `greens_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon`, `created_at`, `updated_at`) VALUES
(1, 'Fotograf', 'fotograf', 'Usługi fotograficzne', '📸', '2025-07-15 10:55:48', '2025-07-15 10:55:48'),
(2, 'Zarządzanie nieruchomościami', 'zarzadzanie-nieruchomosci', 'Profesjonalne zarządzanie nieruchomościami', '🏠', '2025-07-15 10:55:48', '2025-07-15 10:55:48'),
(3, 'Sprzątanie', 'sprzatanie', 'Usługi sprzątania', '🧹', '2025-07-15 10:55:48', '2025-07-15 10:55:48');

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `status` enum('dostępny','niedostępny','zawieszony') NOT NULL DEFAULT 'dostępny',
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `user_type` varchar(255) NOT NULL DEFAULT 'contractor',
  `phone` varchar(255) DEFAULT NULL,
  `subscription` varchar(255) DEFAULT NULL,
  `subscription_end_date` date DEFAULT NULL,
  `nip` varchar(255) DEFAULT NULL,
  `about` text DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `company_description` text DEFAULT NULL,
  `email_new_messages` tinyint(1) NOT NULL DEFAULT 1,
  `email_new_reviews` tinyint(1) NOT NULL DEFAULT 1,
  `email_listing_updates` tinyint(1) NOT NULL DEFAULT 0,
  `email_promotional` tinyint(1) NOT NULL DEFAULT 0,
  `sms_new_messages` tinyint(1) NOT NULL DEFAULT 1,
  `sms_urgent_notifications` tinyint(1) NOT NULL DEFAULT 1,
  `push_new_messages` tinyint(1) NOT NULL DEFAULT 1,
  `push_new_reviews` tinyint(1) NOT NULL DEFAULT 1,
  `profile_visibility` enum('public','registered_only','private') NOT NULL DEFAULT 'public',
  `show_phone` tinyint(1) NOT NULL DEFAULT 1,
  `show_email` tinyint(1) NOT NULL DEFAULT 0,
  `allow_reviews` tinyint(1) NOT NULL DEFAULT 1,
  `allow_messages` tinyint(1) NOT NULL DEFAULT 1,
  `search_engine_indexing` tinyint(1) NOT NULL DEFAULT 1,
  `subscription_type` varchar(255) NOT NULL DEFAULT 'STANDARD',
  `subscription_expires_at` timestamp NULL DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`id`, `name`, `address`, `city`, `status`, `email`, `password`, `email_verified_at`, `remember_token`, `user_type`, `phone`, `subscription`, `subscription_end_date`, `nip`, `about`, `avatar`, `website`, `company_description`, `email_new_messages`, `email_new_reviews`, `email_listing_updates`, `email_promotional`, `sms_new_messages`, `sms_urgent_notifications`, `push_new_messages`, `push_new_reviews`, `profile_visibility`, `show_phone`, `show_email`, `allow_reviews`, `allow_messages`, `search_engine_indexing`, `subscription_type`, `subscription_expires_at`, `user_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'AgroClean Sp. z o.o.', 'Warszawa, ul. Polna 15', NULL, 'dostępny', 'kontakt@agroclean.pl', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, 'contractor', '22 123 45 67', '12 mies.', '2026-08-06', '5252801234', NULL, NULL, NULL, NULL, 1, 1, 0, 0, 1, 1, 1, 1, 'public', 1, 0, 1, 1, 1, 'STANDARD', NULL, NULL, 1, '2025-08-06 07:39:24', '2025-08-06 07:39:24'),
(2, 'EkoFarma Mazowsze', 'Piaseczno, ul. Słoneczna 8', NULL, 'dostępny', 'mariusz@ekofarma.pl', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, 'contractor', '22 756 89 12', '6 mies.', '2026-02-06', '1234567890', NULL, NULL, NULL, NULL, 1, 1, 0, 0, 1, 1, 1, 1, 'public', 1, 0, 1, 1, 1, 'STANDARD', NULL, NULL, 1, '2025-08-06 07:39:24', '2025-08-06 07:41:41'),
(3, 'Green Solutions', 'Kraków, ul. Zielona 42', NULL, 'zawieszony', 'info@greensolutions.pl', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, 'contractor', '12 345 67 89', '3 mies.', '2025-11-06', '6789012345', NULL, NULL, NULL, NULL, 1, 1, 0, 0, 1, 1, 1, 1, 'public', 1, 0, 1, 1, 1, 'STANDARD', NULL, NULL, 1, '2025-08-06 07:39:24', '2025-08-06 07:40:54'),
(4, 'Natura Plus', 'Wrocław, ul. Parkowa 21', NULL, 'dostępny', 'natura@naturaplus.pl', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, 'contractor', '71 234 56 78', '7 mies.', '2026-03-06', '9876543210', NULL, NULL, NULL, NULL, 1, 1, 0, 0, 1, 1, 1, 1, 'public', 1, 0, 1, 1, 1, 'STANDARD', NULL, NULL, 1, '2025-08-06 07:39:24', '2025-08-06 07:39:24'),
(5, 'BioTech Innovations', 'Poznań, ul. Innowacyjna 10', NULL, 'zawieszony', 'office@biotech.pl', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, 'contractor', '61 890 12 34', '1 mies.', '2025-09-06', '112233445', NULL, NULL, NULL, NULL, 1, 1, 0, 0, 1, 1, 1, 1, 'public', 1, 0, 1, 1, 1, 'STANDARD', NULL, NULL, 0, '2025-08-06 07:39:24', '2025-08-06 07:41:01'),
(6, 'Grupa Głowacka', 'Września, Jastrzębia 14A/70', NULL, 'zawieszony', 'roksana.szymanski@rutkowska.pl', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, 'contractor', '+48 236 706 504', '11 mies.', '2026-08-06', '2527169208', NULL, NULL, NULL, NULL, 1, 1, 0, 0, 1, 1, 1, 1, 'public', 1, 0, 1, 1, 1, 'STANDARD', NULL, NULL, 1, '2025-08-06 07:39:24', '2025-08-06 07:39:24'),
(7, 'Jasiński sp. k.', 'Krotoszyn, Kopernika 93', NULL, 'dostępny', 'piotrowski.anita@dudek.net', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, 'contractor', '+48 15 485 75 22', '10 mies.', '2025-09-06', '0198962018', NULL, NULL, NULL, NULL, 1, 1, 0, 0, 1, 1, 1, 1, 'public', 1, 0, 1, 1, 1, 'STANDARD', NULL, NULL, 1, '2025-08-06 07:39:24', '2025-08-06 07:39:24'),
(8, 'Spółdzielnia Tomaszewski', 'Szówsko, Piotra Skargi 29A/58', NULL, 'zawieszony', 'gjankowska@pawlak.net', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, 'contractor', '+48 17 989 09 76', '9 mies.', '2025-09-06', '8326610448', NULL, NULL, NULL, NULL, 1, 1, 0, 0, 1, 1, 1, 1, 'public', 1, 0, 1, 1, 1, 'STANDARD', NULL, NULL, 0, '2025-08-06 07:39:24', '2025-08-06 07:39:24'),
(9, 'Kaczmarczyk sp. p.', 'Starachowice, Legnicka 16A', NULL, 'niedostępny', 'kamila73@brzezinska.com.pl', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, 'contractor', '447447024', '2 mies.', '2026-04-06', '3565635032', NULL, NULL, NULL, NULL, 1, 1, 0, 0, 1, 1, 1, 1, 'public', 1, 0, 1, 1, 1, 'STANDARD', NULL, NULL, 1, '2025-08-06 07:39:24', '2025-08-06 07:39:24'),
(10, 'Zalewska S.A.', 'Sanok, Ludowa 43', NULL, 'zawieszony', 'awilk@wrobel.net.pl', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, 'contractor', '+48 705 889 098', '1 mies.', '2025-10-06', '7324596796', NULL, NULL, NULL, NULL, 1, 1, 0, 0, 1, 1, 1, 1, 'public', 1, 0, 1, 1, 1, 'STANDARD', NULL, NULL, 1, '2025-08-06 07:39:24', '2025-08-06 07:39:24'),
(11, 'Sikorska', 'Starogard Gdański, Rumiankowa 72A/34', NULL, 'dostępny', 'olga.wilk@rutkowski.net', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, 'contractor', '295 440 996', '10 mies.', '2026-05-06', '4308776738', NULL, NULL, NULL, NULL, 1, 1, 0, 0, 1, 1, 1, 1, 'public', 1, 0, 1, 1, 1, 'STANDARD', NULL, NULL, 0, '2025-08-06 07:39:24', '2025-08-06 07:39:24'),
(12, 'Mikrocypki', 'Nie podano', NULL, 'dostępny', 'adam@trojecki.pl', '$2y$12$6t/t6cLUvf0zIisP8RXW8uygz48LJMg6Vx/g.EULBPJ51CBpO1i8q', NULL, NULL, 'contractor', '+48 999 999 999', '1 mies.', '2025-09-08', NULL, NULL, 'avatars/l9IVRQp8KBaiHTZ67enmIyJi2wG6DvdMe1AD5Fwq.p...', NULL, NULL, 1, 1, 0, 0, 1, 1, 1, 1, 'public', 1, 0, 1, 1, 1, 'STANDARD', NULL, NULL, 1, '2025-08-07 11:31:19', '2025-08-08 09:16:46'),
(13, 'Adammmm', 'Warszawa, archacka 123', NULL, 'dostępny', 'adam@gmail.com', '$2y$12$Kyz789sXne6n/vwaeCg2zOigQkfEPiTzJuxot8ZCsqjg/uEaZGV62', NULL, NULL, 'contractor', '669775897', '1 mies.', '2025-09-07', '123123123123', NULL, NULL, NULL, NULL, 1, 1, 0, 0, 1, 1, 1, 1, 'public', 1, 0, 1, 1, 1, 'STANDARD', NULL, NULL, 1, '2025-08-08 07:51:40', '2025-08-08 07:51:40'),
(14, 'Adammmm', 'Warszawa, archacka 123', NULL, 'dostępny', 'adam@trojecki.com', '$2y$12$1Q7EQ/HHidQ/.a6rstZyA..KFKvH70dzyyGGfP1yJMnb4WYYsHRkO', NULL, NULL, 'contractor', '669775897', 'Standard', '2025-09-07', '1231231231232', NULL, NULL, NULL, NULL, 1, 1, 0, 0, 1, 1, 1, 1, 'public', 1, 0, 1, 1, 1, 'STANDARD', NULL, NULL, 1, '2025-08-08 07:54:15', '2025-08-08 07:54:15');

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('new','read','replied') NOT NULL DEFAULT 'new',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `listings`
--

CREATE TABLE `listings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `status` enum('active','inactive','pending') NOT NULL DEFAULT 'active',
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `long_description` text DEFAULT NULL,
  `rating` float DEFAULT NULL,
  `subcategory` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `experience` text DEFAULT NULL,
  `social_media` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`social_media`)),
  `clicks` int(11) DEFAULT 0,
  `published_at` timestamp NULL DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `listings`
--

INSERT INTO `listings` (`id`, `user_id`, `category_id`, `category`, `title`, `description`, `price`, `location`, `status`, `featured`, `created_at`, `updated_at`, `long_description`, `rating`, `subcategory`, `company_name`, `phone`, `email`, `avatar`, `images`, `tags`, `experience`, `social_media`, `clicks`, `published_at`, `is_featured`) VALUES
(16, 1, 1, 'Usługi porządkowe', 'Profesjonalne czyszczenie maszyn rolniczych', 'Szybkie i skuteczne mycie kombajnów, traktorów i innych maszyn.', 250.00, 'Warszawa', 'active', 1, '2025-08-08 12:00:00', '2025-08-11 11:18:15', 'Oferujemy kompleksowe usługi czyszczenia maszyn rolniczych z dojazdem do klienta na terenie całej Polski. Używamy profesjonalnych środków, które są bezpieczne dla środowiska. Gwarantujemy satysfakcję i szybkie terminy realizacji.', 4.8, 'Porządkowe', 'AgroClean Sp. z o.o.', '22 123 45 67', 'kontakt@agroclean.pl', NULL, '[\"/images/agroclean_1.jpg\", \"/images/agroclean_2.jpg\"]', '[\"czyszczenie\", \"rolnictwo\", \"maszyny\", \"konserwacja\"]', '10 lat doświadczenia', '{\"facebook\": \"http://facebook.com/agroclean\"}', 94, '2025-08-08 12:00:00', 1),
(17, 2, 2, 'Usługi porządkowe', 'Sprzedaż ekologicznych warzyw i owoców', 'Świeże, certyfikowane produkty prosto z naszej farmy pod Piasecznem.', 15.50, 'Piaseczno', 'active', 1, '2025-08-07 08:15:00', '2025-08-11 11:12:31', 'Zapraszamy do zakupu naszych ekologicznych produktów. Uprawiamy bez pestycydów i sztucznych nawozów. W ofercie m.in. pomidory, ogórki, jabłka i truskawki sezonowe. Możliwość dostawy na terenie Warszawy i okolic.', 4.9, 'Sprzątanie biur', 'EkoFarma Mazowsze', '22 756 89 12', 'mariusz@ekofarma.pl', NULL, '[\"/images/ekofarma_1.jpg\", \"/images/ekofarma_2.jpg\"]', '[\"eko\", \"warzywa\", \"owoce\", \"bio\", \"zdrowa żywność\"]', 'Firma rodzinna od 5 lat', NULL, 0, '2025-08-07 08:15:00', 0),
(18, 3, 3, 'Usługi porządkowe', 'Instalacja paneli fotowoltaicznych', 'Montaż systemów fotowoltaicznych dla domów i firm. Profesjonalne doradztwo.', 25000.00, 'Kraków', 'active', 0, '2025-08-06 09:00:00', '2025-08-11 11:08:29', 'Zajmujemy się kompleksowym montażem instalacji fotowoltaicznych. Pomagamy w uzyskaniu dofinansowania i załatwieniu wszelkich formalności. Pracujemy na panelach renomowanych producentów.', 4.5, 'Mycie okien', 'Green Solutions', '12 345 67 89', 'info@greensolutions.pl', NULL, '[\"/images/greensolutions_1.jpg\"]', '[\"fotowoltaika\", \"panele słoneczne\", \"oze\", \"energia\"]', 'Ponad 100 zrealizowanych instalacji', '{\"website\": \"http://greensolutions.pl\"}', 0, NULL, 0),
(24, 1, 1, 'Usługi porządkowe', 'Profesjonalne sprzątanie mieszkań', 'Oferujemy kompleksowe sprzątanie mieszkań i domów. Używamy ekologicznych środków czyszczących.', 150.00, 'Kraków', 'active', 0, '2025-08-11 13:17:59', '2025-08-11 13:17:59', NULL, 4.8, 'Sprzątanie mieszkań', 'CleanMaster', '+48 123 456 789', 'kontakt@sprzatanie.pl', NULL, NULL, NULL, NULL, NULL, 0, NULL, 0),
(25, 2, 1, 'Zarządzanie nieruchomościami mieszkalnymi', 'Administracja nieruchomości', 'Kompleksowa administracja budynków mieszkalnych i biurowych.', 2500.00, 'Warszawa', 'active', 1, '2025-08-11 13:17:59', '2025-08-11 11:18:24', NULL, 4.9, 'Administracja', 'AdminPro', '+48 987 654 321', 'biuro@admin-nieruchomosci.pl', NULL, NULL, NULL, NULL, NULL, 4, NULL, 1),
(26, 1, 1, 'Zarządzanie nieruchomościami mieszkalnymi', 'Konserwacja i naprawy', 'Usługi konserwacyjne i naprawcze dla budynków mieszkalnych.', 300.00, 'Gdańsk', 'active', 0, '2025-08-11 13:17:59', '2025-08-11 13:17:59', NULL, 4.5, 'Konserwacja', 'FixIt Service', '+48 555 777 999', 'serwis@naprawy.pl', NULL, NULL, NULL, NULL, NULL, 0, NULL, 0),
(27, 3, 1, 'Zarządzanie nieruchomościami mieszkalnymi', 'Zarządzanie wspólnotą mieszkaniową', 'Profesjonalne zarządzanie wspólnotami mieszkaniowymi.', 1800.00, 'Wrocław', 'active', 1, '2025-08-11 13:17:59', '2025-08-11 13:17:59', NULL, 4.7, 'Zarządzanie wspólnotą', 'Wspólnota Plus', '+48 666 888 111', 'wspolnoty@zarzadzanie.pl', NULL, NULL, NULL, NULL, NULL, 0, NULL, 1),
(28, 2, 1, 'Zarządzanie nieruchomościami mieszkalnymi', 'Nadzór techniczny budynków', 'Profesjonalny nadzór techniczny nad budynkami i instalacjami.', 5000.00, 'Poznań', 'active', 1, '2025-08-11 13:17:59', '2025-08-11 11:18:14', NULL, 4.6, 'Nadzór techniczny', 'TechControl', '+48 444 222 333', 'tech@nadzor.pl', NULL, NULL, NULL, NULL, NULL, 0, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `listing_images`
--

CREATE TABLE `listing_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `listing_id` bigint(20) UNSIGNED NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED DEFAULT NULL,
  `sender_name` varchar(255) NOT NULL,
  `sender_email` varchar(255) NOT NULL,
  `sender_phone` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `message_type` varchar(50) DEFAULT 'inquiry',
  `listing_id` bigint(20) UNSIGNED DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT NULL,
  `status` enum('pending','approved','rejected','replied','resolved','spam') NOT NULL DEFAULT 'pending',
  `is_urgent` tinyint(1) NOT NULL DEFAULT 0,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `admin_reply` text DEFAULT NULL,
  `admin_reply_at` timestamp NULL DEFAULT NULL,
  `replied_at` timestamp NULL DEFAULT NULL,
  `replied_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `user_id`, `company_id`, `sender_name`, `sender_email`, `sender_phone`, `company_name`, `subject`, `message`, `message_type`, `listing_id`, `rating`, `status`, `is_urgent`, `is_read`, `admin_reply`, `admin_reply_at`, `replied_at`, `replied_by`, `created_at`, `updated_at`) VALUES
(21, 1, 1, 'Adam Trojecki', 'adam.trojecki@interia.pl', '669774897', NULL, 'Zapytanie o usługi AgroClean', 'Dzień dobry, interesuje mnie współpraca z Państwa firmą.', 'comment', 16, 5.0, 'approved', 1, 1, NULL, NULL, NULL, NULL, '2025-08-08 08:30:00', '2025-08-11 10:03:47'),
(22, 2, 2, 'Adam Trojecki', 'adam@yellowevents.pl', '+58 123 123 123', NULL, 'Oferta dla EkoFarma', 'Szukam rozwiązań ekologicznych dla firmy.', 'comment', 16, 4.0, 'approved', 0, 0, NULL, NULL, NULL, NULL, '2025-08-08 09:15:00', '2025-08-08 09:15:00'),
(23, 3, 3, 'Test User', 'test@example.com', NULL, NULL, 'Green Solutions - konsultacje', 'Czy świadczicie usługi konsultingowe?', 'comment', 16, 4.0, 'approved', 0, 1, 'Tak, oferujemy szeroki zakres konsultacji.', NULL, '2025-08-07 14:30:00', 9, '2025-08-07 13:00:00', '2025-08-07 14:30:00'),
(24, 11, NULL, 'Adam Trojecki', 'admin@wp.pl', '+48987987987', NULL, 'Komentarz do ogłoszenia', 'asdadsdsa', 'comment', 16, 5.0, 'approved', 0, 1, 'jd', NULL, '2025-08-11 10:09:01', 9, '2025-08-11 10:03:16', '2025-08-11 10:18:42'),
(25, 11, NULL, 'Adam Trojecki', 'admin@wp.pl', '+48987987987', NULL, 'Komentarz do ogłoszenia', 'jjjjjdasadsdasadsads', 'comment', 16, 4.0, 'approved', 0, 1, NULL, NULL, NULL, NULL, '2025-08-11 10:09:32', '2025-08-11 10:33:18'),
(26, 9, NULL, 'Administrator', 'admin@greens.pl', NULL, NULL, 'Komentarz do ogłoszenia', 'adam', 'inquiry', NULL, NULL, 'approved', 0, 1, NULL, NULL, NULL, NULL, '2025-08-11 10:17:52', '2025-08-11 10:33:16');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_07_15_115419_create_personal_access_tokens_table', 1),
(5, '2025_07_15_124235_add_fields_to_users_table', 1),
(6, '2025_07_15_124235_create_categories_table', 1),
(8, '2025_07_15_124236_create_listing_images_table', 1),
(9, '2025_07_15_124236_create_ratings_table', 1),
(10, '2025_07_15_124236_create_user_specializations_table', 1),
(11, '2025_07_15_124237_create_contact_messages_table', 1),
(12, '2025_08_06_084029_create_subscriptions_table', 2),
(13, '2025_08_06_085729_create_subscriptions_table', 1),
(14, '2025_08_06_090218_fix_subscriptions_table_add_all_columns', 3),
(15, '2025_08_06_093528_create_companies_table', 4),
(16, '2025_08_07_090345_create_reviews_table', 5),
(17, '2025_08_06_131010_create_complete_listings_table', 5),
(18, '2025_08_06_131213_add_missing_columns_to_listings_table', 5),
(19, '2025_08_07_090345_create_reviews_table', 5),
(20, '2025_08_08_081559_create_messages_table', 6),
(21, '2025_08_08_090443_add_auth_fields_to_companies_table', 7);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'auth-token', '74fce0b0b986bc98c56088c40ae37c7c2fbfbe003b68e273be76165cd06d8fee', '[\"*\"]', '2025-07-15 11:46:36', NULL, '2025-07-15 11:30:22', '2025-07-15 11:46:36'),
(2, 'App\\Models\\User', 2, 'auth-token', 'c2256ca01fdef4d4c4edb95e06e0a573ae70c55e3c4c8dd8aa08bdf1a13fa112', '[\"*\"]', '2025-07-16 06:19:57', NULL, '2025-07-16 06:19:54', '2025-07-16 06:19:57'),
(10, 'App\\Models\\User', 10, 'auth-token', '091409d63962902f5f2b31f8364d5d5e24dc04ffd5c6045201b1e46aca9bf87e', '[\"*\"]', '2025-08-07 12:10:17', NULL, '2025-08-07 12:06:14', '2025-08-07 12:10:17'),
(12, 'App\\Models\\User', 10, 'auth-token', '9f8a202e6eef1a6e5a93981ac171a28fc9621a38d62994feeaaa8fed5109dde4', '[\"*\"]', '2025-08-08 06:59:54', NULL, '2025-08-08 06:42:27', '2025-08-08 06:59:54'),
(14, 'App\\Models\\Company', 12, 'auth_token', 'd4cfb50deb576ef942e6e4dbd524704944d05f6bb9ea032aa75acf0d54954135', '[\"*\"]', NULL, NULL, '2025-08-08 07:35:08', '2025-08-08 07:35:08'),
(15, 'App\\Models\\Company', 12, 'auth_token', '5cbfa5dad14e2c4fd90cd8a94f2d96f463abd595d382928d6a7fc18636b018e5', '[\"*\"]', NULL, NULL, '2025-08-08 07:35:43', '2025-08-08 07:35:43'),
(16, 'App\\Models\\Company', 12, 'auth_token', 'ec492330af8f1e6638ac2f23771ee14682a4fe6717ab1a59c48f4a2a0104ca12', '[\"*\"]', NULL, NULL, '2025-08-08 07:39:40', '2025-08-08 07:39:40'),
(17, 'App\\Models\\Company', 12, 'auth_token', 'aacc7c114d6c6dc8a9f668433f45af562dbe33114ed3d7762f414ef703d50eb9', '[\"*\"]', NULL, NULL, '2025-08-08 07:48:14', '2025-08-08 07:48:14'),
(18, 'App\\Models\\Company', 12, 'auth_token', 'a7dcef5e4ff5e9fa62c9a1e90adefa7fe450aa106f8f7d1b17be3f4e70f7f2f8', '[\"*\"]', NULL, NULL, '2025-08-08 07:48:15', '2025-08-08 07:48:15'),
(20, 'App\\Models\\Company', 12, 'auth_token', 'c24483c128c6d73b7fe329695f3ba7f5b47bb1b35248a8362e910360e9134df3', '[\"*\"]', NULL, NULL, '2025-08-08 07:49:16', '2025-08-08 07:49:16'),
(21, 'App\\Models\\Company', 13, 'auth_token', '36116aba1f0d23bfbb3dd391d963c73d5cbaf2ee8782f503d932582de42430a8', '[\"*\"]', NULL, NULL, '2025-08-08 07:51:40', '2025-08-08 07:51:40'),
(25, 'App\\Models\\Company', 14, 'auth_token', 'b4f755b65816dfaa455445baed18bc29ee29f1599ffad310814c1624d8fb270b', '[\"*\"]', '2025-08-08 10:00:20', NULL, '2025-08-08 10:00:11', '2025-08-08 10:00:20'),
(26, 'App\\Models\\Company', 14, 'auth_token', '851430b8888c6efefbb1a381b94f7c5427516b1c6275800185c38126a3948975', '[\"*\"]', NULL, NULL, '2025-08-08 10:28:09', '2025-08-08 10:28:09'),
(27, 'App\\Models\\Company', 14, 'auth_token', 'c21588ddb17ebdca9e31f1ab9e50a2ba246aa666d0e3297f2b8ba6cee9977008', '[\"*\"]', NULL, NULL, '2025-08-08 10:28:43', '2025-08-08 10:28:43'),
(28, 'App\\Models\\Company', 14, 'auth_token', '7eae6039efc357205fe3afefc89d496cf78b3ed4230ecf16c6fdd7075a2bfbee', '[\"*\"]', '2025-08-08 11:32:59', NULL, '2025-08-08 10:29:05', '2025-08-08 11:32:59'),
(33, 'App\\Models\\Company', 13, 'auth_token', 'e107d907a173e445689ae4afa7efb6cb451579a9b5d8463388ee9296528789a6', '[\"*\"]', '2025-08-11 11:50:23', NULL, '2025-08-11 11:26:14', '2025-08-11 11:50:23');

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `rated_user_id` bigint(20) UNSIGNED NOT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `order_number` varchar(255) DEFAULT NULL,
  `order_date` date DEFAULT NULL,
  `is_hidden` tinyint(1) NOT NULL DEFAULT 0,
  `admin_note` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `user_id`, `company_id`, `rating`, `comment`, `order_number`, `order_date`, `is_hidden`, `admin_note`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 5, 'Doskonałe sprzątanie biura! Ekipa bardzo profesjonalna, wszystko zostało wykonane w terminie. Polecam AgroClean każdemu.', 'ORD-2025-001', '2025-08-01', 0, NULL, '2025-08-02 08:30:00', '2025-08-02 08:30:00'),
(2, 2, 1, 4, 'Bardzo dobra jakość usług sprzątania. Jedyny minus to trochę wysoka cena, ale jakość rekompensuje koszt.', 'ORD-2025-002', '2025-08-03', 0, NULL, '2025-08-04 12:15:00', '2025-08-04 12:15:00'),
(3, 3, 2, 5, 'Fantastyczne warzywa ekologiczne! Świeże, smaczne, widać że uprawiane z pasją. EkoFarma to prawdziwa perełka.', 'ORD-2025-003', '2025-08-02', 0, NULL, '2025-08-03 14:20:00', '2025-08-03 14:20:00'),
(4, 1, 2, 5, 'Kupuję warzywa od EkoFarma już od pół roku. Jakość zawsze na najwyższym poziomie, a ceny uczciwe.', 'ORD-2025-004', '2025-08-04', 0, NULL, '2025-08-05 07:45:00', '2025-08-05 07:45:00'),
(5, 6, 3, 3, 'Konsultacje były pomocne, ale oczekiwałem większej konkretności w rekomendacjach. Obsługa w porządku.', 'ORD-2025-005', '2025-07-28', 0, 'Klient wymagał bardziej szczegółowego planu działania', '2025-07-30 09:00:00', '2025-07-30 09:00:00'),
(6, 2, 4, 5, 'Natura Plus to najlepsze nawozy jakich używałem! Rośliny rosną jak szalone, a wszystko naturalne.', 'ORD-2025-006', '2025-08-01', 0, NULL, '2025-08-02 13:30:00', '2025-08-02 13:30:00'),
(7, 7, 4, 4, 'Bardzo dobre nawozy organiczne. Zauważalna poprawa kondycji roślin po zastosowaniu. Polecam!', 'ORD-2025-007', '2025-08-05', 0, NULL, '2025-08-06 10:10:00', '2025-08-06 10:10:00'),
(8, 3, 5, 4, 'Innowacyjne podejście do biotechnologii. BioTech pomógł nam wdrożyć nowe rozwiązania w firmie.', 'ORD-2025-008', '2025-07-25', 0, NULL, '2025-07-28 11:45:00', '2025-07-28 11:45:00'),
(9, 1, 6, 4, 'Zarządzanie nieruchomością przez Grupę Głowacka przebiega sprawnie. Kontakt bardzo dobry, polecam.', 'ORD-2025-009', '2025-07-30', 0, NULL, '2025-08-01 06:20:00', '2025-08-01 06:20:00'),
(10, 2, 7, 5, 'Jasiński wykonał u nas remont łazienki. Szybko, czysto, profesjonalnie. Bardzo polecam!', 'ORD-2025-010', '2025-08-03', 0, NULL, '2025-08-04 15:00:00', '2025-08-04 15:00:00'),
(11, 6, 7, 4, 'Dobry hydraulik, punktualny i rzetelny. Ceny uczciwe, jakość wykonania bardzo dobra.', 'ORD-2025-011', '2025-08-06', 0, NULL, '2025-08-07 08:15:00', '2025-08-07 08:15:00'),
(12, 3, 8, 5, 'Spółdzielnia Tomaszewski to wspaniała inicjatywa społeczna. Usługi na wysokim poziomie, podejście bardzo osobiste.', 'ORD-2025-012', '2025-07-20', 0, NULL, '2025-07-22 12:30:00', '2025-07-22 12:30:00'),
(13, 1, 1, 2, 'Słaba jakość sprzątania, nie polecam tej firmy. Zostawili brud w rogach.', 'ORD-2025-013', '2025-08-05', 1, 'Opinia ukryta - niesprawdzone zarzuty', '2025-08-06 07:00:00', '2025-08-06 07:00:00'),
(14, 2, 3, 1, 'Totalna porażka! Nie polecam Green Solutions nikomu!!!', 'ORD-2025-014', '2025-08-04', 1, 'Opinia ukryta - spam', '2025-08-05 09:30:00', '2025-08-05 09:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `duration` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subscriptions`
--

INSERT INTO `subscriptions` (`id`, `name`, `duration`, `price`, `description`, `features`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 'STANDARD', 'jeden miesiąc', 122.20, NULL, NULL, 1, 0, NULL, '2025-08-08 06:04:24'),
(2, 'PLUS', 'pół roku', 130.00, NULL, NULL, 1, 0, NULL, '2025-08-07 06:33:54'),
(3, 'PREMIUM', 'cały rok', 52.00, NULL, NULL, 1, 0, NULL, '2025-08-08 06:04:38');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `nip` varchar(255) DEFAULT NULL,
  `about` text DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT 0,
  `user_type` varchar(20) DEFAULT 'client',
  `company_name` varchar(255) DEFAULT NULL,
  `company_description` text DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `email_new_messages` tinyint(1) DEFAULT 1,
  `email_new_reviews` tinyint(1) DEFAULT 1,
  `email_listing_updates` tinyint(1) DEFAULT 0,
  `email_promotional` tinyint(1) DEFAULT 0,
  `sms_new_messages` tinyint(1) DEFAULT 1,
  `sms_urgent_notifications` tinyint(1) DEFAULT 1,
  `push_new_messages` tinyint(1) DEFAULT 1,
  `push_new_reviews` tinyint(1) DEFAULT 1,
  `profile_visibility` enum('public','registered_only','private') DEFAULT 'public',
  `show_phone` tinyint(1) DEFAULT 1,
  `show_email` tinyint(1) DEFAULT 0,
  `allow_reviews` tinyint(1) DEFAULT 1,
  `allow_messages` tinyint(1) DEFAULT 1,
  `search_engine_indexing` tinyint(1) DEFAULT 1,
  `subscription_type` enum('STANDARD','PLUS','PREMIUM') DEFAULT 'STANDARD',
  `subscription_expires_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `phone`, `address`, `city`, `nip`, `about`, `avatar`, `is_admin`, `user_type`, `company_name`, `company_description`, `website`, `email_new_messages`, `email_new_reviews`, `email_listing_updates`, `email_promotional`, `sms_new_messages`, `sms_urgent_notifications`, `push_new_messages`, `push_new_reviews`, `profile_visibility`, `show_phone`, `show_email`, `allow_reviews`, `allow_messages`, `search_engine_indexing`, `subscription_type`, `subscription_expires_at`) VALUES
(1, 'Adam Trojecki', 'adam.trojecki@interia.pl', NULL, '$2y$12$ggI0cKI8tGHZGb7XlStp6uooVnbkW9n0d5NK4Q0WUBW...', NULL, '2025-07-15 11:30:22', '2025-07-15 11:30:22', '669774897', NULL, NULL, NULL, NULL, NULL, 0, 'client', NULL, NULL, NULL, 1, 1, 0, 0, 1, 1, 1, 1, 'public', 1, 0, 1, 1, 1, 'STANDARD', NULL),
(2, 'Adam Trojecki', 'adam@yellowevents.pl', NULL, '$2y$12$ONIQuMHh8r8MY1dsrePNZuVhAfwyYa3B1pj/GBnH8Te...', NULL, '2025-07-16 06:19:54', '2025-07-16 06:19:54', '+58 123 123 123', NULL, NULL, NULL, NULL, NULL, 0, 'client', NULL, NULL, NULL, 1, 1, 0, 0, 1, 1, 1, 1, 'public', 1, 0, 1, 1, 1, 'STANDARD', NULL),
(3, 'Test User', 'test@example.com', '2025-08-06 06:43:51', '$2y$12$BFtQJdf6U60H9SwBTeSI4.ty.SAG/0SIE5FvDjBDVwL...', 'iqIY7bLudg', '2025-08-06 06:43:52', '2025-08-06 06:43:52', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'client', NULL, NULL, NULL, 1, 1, 0, 0, 1, 1, 1, 1, 'public', 1, 0, 1, 1, 1, 'STANDARD', NULL),
(6, 'Firma CleanPro', 'contact@cleanpro.pl', NULL, '$2y$12$examplehashedpassword1...', NULL, '2025-08-06 13:33:53', '2025-08-06 13:33:53', '+48 123 456 789', NULL, NULL, NULL, NULL, NULL, 0, 'client', NULL, NULL, NULL, 1, 1, 0, 0, 1, 1, 1, 1, 'public', 1, 0, 1, 1, 1, 'STANDARD', NULL),
(7, 'Firma SprzataniePlus', 'kontakt@sprzatanieplus.pl', NULL, '$2y$12$examplehashedpassword2...', NULL, '2025-08-06 13:33:53', '2025-08-06 13:33:53', '+48 987 654 321', NULL, NULL, NULL, NULL, NULL, 0, 'client', NULL, NULL, NULL, 1, 1, 0, 0, 1, 1, 1, 1, 'public', 1, 0, 1, 1, 1, 'STANDARD', NULL),
(9, 'Administrator', 'admin@greens.pl', '2025-08-07 07:52:03', '$2y$12$PH359eQTDdsTZqBmzzWGzec3rDKwqrf6IrL1TfcfVu7LPRF80DWWu', NULL, '2025-08-07 07:52:07', '2025-08-07 07:52:07', NULL, NULL, NULL, NULL, NULL, NULL, 1, 'client', NULL, NULL, NULL, 1, 1, 0, 0, 1, 1, 1, 1, 'public', 1, 0, 1, 1, 1, 'STANDARD', NULL),
(11, 'Adam Trojecki', 'admin@wp.pl', NULL, '$2y$12$7JqVYF9Ob/qA5zYBqaDQU.InaPPvwizG/FTOtADyRrTnGK5GAIuVy', NULL, '2025-08-11 09:01:17', '2025-08-11 09:01:17', '+48987987987', NULL, 'Warszawa', NULL, NULL, NULL, 0, 'client', NULL, NULL, NULL, 1, 1, 0, 0, 1, 1, 1, 1, 'public', 1, 0, 1, 1, 1, 'STANDARD', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_specializations`
--

CREATE TABLE `user_specializations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `specialization` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_slug_unique` (`slug`);

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `companies_email_unique` (`email`),
  ADD UNIQUE KEY `companies_nip_unique` (`nip`),
  ADD KEY `companies_user_id_foreign` (`user_id`),
  ADD KEY `companies_status_index` (`status`),
  ADD KEY `companies_is_active_index` (`is_active`),
  ADD KEY `companies_nip_index` (`nip`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `listings`
--
ALTER TABLE `listings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `listings_user_id_foreign` (`user_id`),
  ADD KEY `listings_category_id_foreign` (`category_id`);

--
-- Indexes for table `listing_images`
--
ALTER TABLE `listing_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `listing_images_listing_id_foreign` (`listing_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `messages_user_id_foreign` (`user_id`),
  ADD KEY `messages_company_id_foreign` (`company_id`),
  ADD KEY `fk_messages_replied_by` (`replied_by`),
  ADD KEY `idx_messages_listing_type_status` (`listing_id`,`message_type`,`status`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ratings_user_id_rated_user_id_unique` (`user_id`,`rated_user_id`),
  ADD KEY `ratings_rated_user_id_foreign` (`rated_user_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reviews_company_id_created_at_index` (`company_id`,`created_at`),
  ADD KEY `reviews_user_id_created_at_index` (`user_id`,`created_at`),
  ADD KEY `reviews_rating_index` (`rating`),
  ADD KEY `reviews_is_hidden_index` (`is_hidden`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subscriptions_name_unique` (`name`),
  ADD KEY `subscriptions_name_index` (`name`),
  ADD KEY `subscriptions_is_active_index` (`is_active`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `user_specializations`
--
ALTER TABLE `user_specializations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_specializations_user_id_foreign` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `listings`
--
ALTER TABLE `listings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `listing_images`
--
ALTER TABLE `listing_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `user_specializations`
--
ALTER TABLE `user_specializations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `companies`
--
ALTER TABLE `companies`
  ADD CONSTRAINT `companies_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `listings`
--
ALTER TABLE `listings`
  ADD CONSTRAINT `listings_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `listings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `listing_images`
--
ALTER TABLE `listing_images`
  ADD CONSTRAINT `listing_images_listing_id_foreign` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `fk_messages_listing_id` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_messages_replied_by` FOREIGN KEY (`replied_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `messages_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_replied_by_foreign` FOREIGN KEY (`replied_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `messages_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_rated_user_id_foreign` FOREIGN KEY (`rated_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ratings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_specializations`
--
ALTER TABLE `user_specializations`
  ADD CONSTRAINT `user_specializations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
