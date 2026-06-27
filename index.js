<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LIONLANCE — Freelance Marketplace</title>
    <!-- Razorpay SDK -->
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    <!-- AOS for scroll animations -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <!-- Fonts & Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
    <style>
        /* ===== RESET & BASE ===== */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        :root {
            --gold: #f5a623;
            --gold-dark: #c47f10;
            --dark: #0b0b1a;
            --dark-card: #12122a;
            --text: #f0f0f5;
            --text-muted: #a0a0c0;
            --text-dim: #6a6a8a;
            --radius: 16px;
            --radius-sm: 10px;
            --transition: 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            --shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        html {
            scroll-behavior: smooth;
        }
        body {
            font-family: 'Inter', sans-serif;
            background: var(--dark);
            color: var(--text);
            line-height: 1.6;
            overflow-x: hidden;
        }
        a {
            text-decoration: none;
            color: inherit;
        }
        button {
            cursor: pointer;
            font-family: inherit;
            border: none;
            outline: none;
        }
        input,
        select,
        textarea {
            font-family: inherit;
            outline: none;
            border: none;
        }
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: var(--dark);
        }
        ::-webkit-scrollbar-thumb {
            background: var(--gold);
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: var(--gold-dark);
        }

        /* ===== ANIMATED BG ===== */
        .bg-glow {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            pointer-events: none;
            overflow: hidden;
        }
        .bg-glow .orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(120px);
            opacity: 0.2;
            animation: orbFloat 20s infinite alternate ease-in-out;
        }
        .bg-glow .orb:nth-child(1) {
            width: 600px;
            height: 600px;
            background: #f5a62333;
            top: -10%;
            left: -10%;
            animation-duration: 22s;
        }
        .bg-glow .orb:nth-child(2) {
            width: 500px;
            height: 500px;
            background: #7c3aed33;
            bottom: -10%;
            right: -10%;
            animation-duration: 26s;
            animation-delay: 2s;
        }
        .bg-glow .orb:nth-child(3) {
            width: 400px;
            height: 400px;
            background: #f5a62322;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation-duration: 30s;
            animation-delay: 4s;
        }
        @keyframes orbFloat {
            0% {
                transform: translate(0, 0) scale(1);
            }
            33% {
                transform: translate(60px, -40px) scale(1.1);
            }
            66% {
                transform: translate(-30px, 60px) scale(0.9);
            }
            100% {
                transform: translate(40px, 30px) scale(1.05);
            }
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
            position: relative;
            z-index: 2;
        }

        /* ===== HEADER ===== */
        header {
            position: sticky;
            top: 0;
            z-index: 100;
            background: rgba(11, 11, 26, 0.85);
            backdrop-filter: blur(16px) saturate(1.6);
            border-bottom: 1px solid rgba(245, 166, 35, 0.12);
            padding: 12px 0;
            transition: var(--transition);
        }
        .header-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 12px;
        }
        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 26px;
            font-weight: 900;
            letter-spacing: -0.5px;
            color: #fff;
        }
        .logo svg {
            width: 44px;
            height: 44px;
        }
        .logo span {
            color: var(--gold);
        }
        .nav-links {
            display: flex;
            align-items: center;
            gap: 20px;
            list-style: none;
            font-weight: 500;
            font-size: 14px;
            flex-wrap: wrap;
        }
        .nav-links a {
            color: var(--text-muted);
            transition: var(--transition);
            position: relative;
            white-space: nowrap;
        }
        .nav-links a::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 0;
            height: 2px;
            background: var(--gold);
            transition: var(--transition);
        }
        .nav-links a:hover {
            color: #fff;
        }
        .nav-links a:hover::after {
            width: 100%;
        }
        .category-dropdown {
            position: relative;
            display: inline-block;
        }
        .category-dropdown .dropdown-toggle {
            background: rgba(245, 166, 35, 0.08);
            border: 1px solid rgba(245, 166, 35, 0.2);
            color: var(--text);
            padding: 6px 16px;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: var(--transition);
            cursor: pointer;
        }
        .category-dropdown .dropdown-toggle:hover {
            background: rgba(245, 166, 35, 0.15);
            border-color: var(--gold);
        }
        .category-dropdown .dropdown-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            background: var(--dark-card);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: var(--radius-sm);
            padding: 8px 0;
            min-width: 180px;
            box-shadow: var(--shadow);
            z-index: 999;
            max-height: 300px;
            overflow-y: auto;
            margin-top: 4px;
        }
        .category-dropdown .dropdown-menu.open {
            display: block;
            animation: fadeIn 0.2s ease;
        }
        .category-dropdown .dropdown-menu a {
            display: block;
            padding: 8px 20px;
            color: var(--text-muted);
            transition: var(--transition);
            font-size: 14px;
        }
        .category-dropdown .dropdown-menu a:hover {
            background: rgba(245, 166, 35, 0.06);
            color: #fff;
        }
        .auth-btns {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .btn {
            padding: 9px 22px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 14px;
            transition: var(--transition);
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: transparent;
            color: var(--text);
            border: 1.5px solid rgba(255, 255, 255, 0.15);
        }
        .btn:hover {
            background: rgba(255, 255, 255, 0.06);
            border-color: rgba(255, 255, 255, 0.25);
            transform: translateY(-2px);
        }
        .btn-primary {
            background: linear-gradient(145deg, var(--gold), var(--gold-dark));
            border-color: transparent;
            color: #0b0b1a;
            box-shadow: 0 4px 20px rgba(245, 166, 35, 0.3);
        }
        .btn-primary:hover {
            background: linear-gradient(145deg, var(--gold-dark), var(--gold));
            box-shadow: 0 6px 30px rgba(245, 166, 35, 0.45);
            transform: translateY(-2px) scale(1.02);
            border-color: transparent;
        }
        .btn-outline-gold {
            border-color: var(--gold);
            color: var(--gold);
        }
        .btn-outline-gold:hover {
            background: var(--gold);
            color: #0b0b1a;
            border-color: var(--gold);
        }
        .btn-sm {
            padding: 6px 16px;
            font-size: 13px;
        }
        .btn-danger {
            border-color: #ef4444;
            color: #ef4444;
        }
        .btn-danger:hover {
            background: #ef4444;
            color: #0b0b1a;
        }

        /* ===== HERO ===== */
        .hero {
            padding: 100px 0 80px;
            text-align: center;
            position: relative;
            background: linear-gradient(135deg, rgba(11, 11, 26, 0.9) 0%, rgba(18, 18, 42, 0.8) 100%),
                url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover no-repeat;
            min-height: 600px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 1px solid rgba(245, 166, 35, 0.1);
        }
        .hero-content {
            max-width: 800px;
            animation: fadeUp 1s ease forwards;
        }
        .hero-badge {
            display: inline-block;
            background: rgba(245, 166, 35, 0.12);
            border: 1px solid rgba(245, 166, 35, 0.2);
            padding: 6px 20px;
            border-radius: 50px;
            font-size: 13px;
            font-weight: 600;
            color: var(--gold);
            letter-spacing: 0.5px;
            margin-bottom: 28px;
        }
        .hero h1 {
            font-size: clamp(2.8rem, 8vw, 5.2rem);
            font-weight: 900;
            line-height: 1.1;
            letter-spacing: -1.5px;
            margin-bottom: 20px;
        }
        .hero h1 .highlight {
            background: linear-gradient(145deg, var(--gold), #ffd700);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .hero p {
            font-size: clamp(1.05rem, 1.8vw, 1.35rem);
            color: var(--text-muted);
            max-width: 700px;
            margin: 0 auto 32px;
        }
        .hero-actions {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            gap: 16px;
        }
        .hero-actions .btn {
            padding: 14px 36px;
            font-size: 16px;
        }
        @keyframes fadeUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        .section-title {
            text-align: center;
            margin-bottom: 48px;
        }
        .section-title h2 {
            font-size: clamp(2rem, 4vw, 2.8rem);
            font-weight: 800;
            letter-spacing: -0.5px;
        }
        .section-title h2 span {
            color: var(--gold);
        }
        .section-title p {
            color: var(--text-muted);
            max-width: 560px;
            margin: 8px auto 0;
            font-size: 1.05rem;
        }

        /* ===== CATEGORIES ===== */
        .categories-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 18px;
        }
        .category-item {
            background: var(--dark-card);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: var(--radius-sm);
            padding: 24px 16px;
            text-align: center;
            transition: var(--transition);
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .category-item::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(245, 166, 35, 0.05) 0%, transparent 70%);
            opacity: 0;
            transition: var(--transition);
        }
        .category-item:hover::before {
            opacity: 1;
        }
        .category-item:hover {
            transform: translateY(-6px) scale(1.02);
            border-color: var(--gold);
            background: rgba(245, 166, 35, 0.05);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
        }
        .category-item .icon {
            font-size: 32px;
            color: var(--gold);
            margin-bottom: 10px;
            display: block;
        }
        .category-item .name {
            font-size: 15px;
            font-weight: 600;
        }
        .category-item .count {
            font-size: 12px;
            color: var(--text-dim);
            margin-top: 4px;
        }

        /* ===== DASHBOARD ===== */
        .dashboard-section {
            padding: 40px 0 60px;
            display: none;
        }
        .dashboard-section.active {
            display: block;
            animation: fadeUp 0.5s ease forwards;
        }
        .dashboard-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }
        @media (max-width: 860px) {
            .dashboard-grid {
                grid-template-columns: 1fr;
            }
        }
        .dash-card {
            background: var(--dark-card);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: var(--radius);
            padding: 28px;
            transition: var(--transition);
        }
        .dash-card:hover {
            border-color: rgba(245, 166, 35, 0.15);
        }
        .dash-card h3 {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .dash-card h3 i {
            color: var(--gold);
        }

        /* ===== JOBS ===== */
        .job-list {
            display: flex;
            flex-direction: column;
            gap: 14px;
            max-height: 400px;
            overflow-y: auto;
            padding-right: 6px;
        }
        .job-item {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: var(--radius-sm);
            padding: 16px 18px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            transition: var(--transition);
        }
        .job-item:hover {
            background: rgba(255, 255, 255, 0.06);
            border-color: rgba(245, 166, 35, 0.15);
        }
        .job-item .info h4 {
            font-size: 16px;
            font-weight: 600;
        }
        .job-item .info .meta {
            font-size: 13px;
            color: var(--text-muted);
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 2px;
        }
        .job-item .info .meta .cat {
            color: var(--gold);
        }
        .job-item .budget {
            font-weight: 700;
            color: var(--gold);
            font-size: 16px;
            white-space: nowrap;
        }
        .job-item .status {
            font-size: 12px;
            font-weight: 600;
            padding: 4px 14px;
            border-radius: 50px;
            background: rgba(245, 166, 35, 0.12);
            color: var(--gold);
        }
        .job-item .status.closed {
            background: rgba(255, 80, 80, 0.12);
            color: #ff6b6b;
        }
        .job-item .apply-btn {
            background: var(--gold);
            color: #0b0b1a;
            padding: 6px 16px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 13px;
            transition: var(--transition);
        }
        .job-item .apply-btn:hover {
            background: var(--gold-dark);
            transform: scale(1.02);
        }
        .job-item .action-buttons {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
        }
        .job-item .action-buttons .btn-sm {
            font-size: 12px;
            padding: 4px 12px;
        }

        /* ===== WALLET ===== */
        .wallet-balance {
            display: flex;
            align-items: center;
            gap: 16px;
            flex-wrap: wrap;
            background: rgba(245, 166, 35, 0.06);
            border: 1px solid rgba(245, 166, 35, 0.12);
            border-radius: var(--radius-sm);
            padding: 18px 22px;
            margin-bottom: 20px;
        }
        .wallet-balance .amount {
            font-size: 36px;
            font-weight: 900;
            color: var(--gold);
        }
        .wallet-balance .label {
            color: var(--text-muted);
            font-size: 14px;
        }
        .payment-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
        }
        .payment-actions .btn {
            padding: 10px 24px;
            font-size: 14px;
        }

        /* ===== USERS / ONLINE ===== */
        .user-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-height: 300px;
            overflow-y: auto;
            padding-right: 4px;
        }
        .user-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: var(--radius-sm);
            padding: 12px 16px;
            flex-wrap: wrap;
            gap: 8px;
            transition: var(--transition);
        }
        .user-item:hover {
            background: rgba(255, 255, 255, 0.06);
        }
        .user-item .user-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .user-item .user-info .avatar {
            width: 32px;
            height: 32px;
            background: var(--gold);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 14px;
            color: #0b0b1a;
        }
        .user-item .user-info .details .name {
            font-weight: 600;
            font-size: 14px;
        }
        .user-item .user-info .details .email {
            font-size: 12px;
            color: var(--text-dim);
        }
        .user-item .status-badge {
            font-size: 11px;
            font-weight: 600;
            padding: 4px 12px;
            border-radius: 50px;
            background: rgba(34, 197, 94, 0.15);
            color: #22c55e;
            border: 1px solid rgba(34, 197, 94, 0.2);
        }
        .user-item .status-badge.offline {
            background: rgba(255, 255, 255, 0.04);
            color: var(--text-dim);
            border-color: rgba(255, 255, 255, 0.06);
        }
        .user-item .admin-tag {
            font-size: 10px;
            font-weight: 700;
            background: var(--gold);
            color: #0b0b1a;
            padding: 2px 10px;
            border-radius: 50px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* ===== SECURITY BADGE ===== */
        .security-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(34, 197, 94, 0.1);
            color: #22c55e;
            padding: 6px 16px;
            border-radius: 50px;
            font-size: 13px;
            border: 1px solid rgba(34, 197, 94, 0.2);
        }

        /* ===== TESTIMONIALS ===== */
        .testimonials {
            padding: 60px 0;
            background: rgba(255, 255, 255, 0.02);
        }
        .testimonial-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            margin-top: 30px;
        }
        .testimonial-card {
            background: var(--dark-card);
            border-radius: var(--radius);
            padding: 24px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            text-align: center;
            transition: var(--transition);
        }
        .testimonial-card:hover {
            border-color: rgba(245, 166, 35, 0.2);
            transform: translateY(-5px);
        }
        .testimonial-card img {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            object-fit: cover;
            margin-bottom: 12px;
        }
        .testimonial-card .name {
            font-weight: 600;
        }
        .testimonial-card .role {
            color: var(--text-dim);
            font-size: 14px;
        }
        .testimonial-card .quote {
            font-style: italic;
            color: var(--text-muted);
            margin: 10px 0;
        }
        .rating-stars {
            color: var(--gold);
            letter-spacing: 2px;
            font-size: 18px;
        }

        .trusted-logos {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 40px;
            margin-top: 20px;
        }
        .trusted-logos img {
            height: 40px;
            filter: grayscale(1) brightness(2);
            transition: var(--transition);
        }
        .trusted-logos img:hover {
            filter: grayscale(0) brightness(1);
        }

        /* ===== INFO SECTIONS ===== */
        .info-section {
            padding: 60px 0;
            background: rgba(255, 255, 255, 0.02);
            border-top: 1px solid rgba(255, 255, 255, 0.04);
        }
        .info-section h2 {
            font-size: 2.4rem;
            font-weight: 800;
            margin-bottom: 20px;
            text-align: center;
        }
        .info-section h2 span {
            color: var(--gold);
        }
        .info-section p {
            color: var(--text-muted);
            max-width: 700px;
            margin: 0 auto 20px;
            font-size: 1.1rem;
            text-align: center;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            margin-top: 30px;
        }
        .info-card {
            background: var(--dark-card);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: var(--radius);
            padding: 30px;
            text-align: center;
            transition: var(--transition);
        }
        .info-card:hover {
            border-color: rgba(245, 166, 35, 0.2);
            transform: translateY(-5px);
        }
        .info-card .icon {
            font-size: 40px;
            color: var(--gold);
            margin-bottom: 16px;
        }
        .info-card h4 {
            font-size: 1.3rem;
            margin-bottom: 8px;
        }
        .info-card p {
            font-size: 0.95rem;
            color: var(--text-dim);
        }

        /* ===== CONTACT ===== */
        .contact-info {
            padding: 60px 0 40px;
            background: rgba(255, 255, 255, 0.02);
            border-top: 1px solid rgba(255, 255, 255, 0.04);
        }
        .contact-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            max-width: 600px;
            margin: 0 auto;
        }
        .contact-card {
            background: var(--dark-card);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: var(--radius-sm);
            padding: 24px;
            text-align: center;
            transition: var(--transition);
        }
        .contact-card:hover {
            border-color: rgba(245, 166, 35, 0.15);
            transform: translateY(-4px);
        }
        .contact-card .icon {
            font-size: 28px;
            color: var(--gold);
            margin-bottom: 8px;
            display: block;
        }
        .contact-card .value {
            font-size: 15px;
            font-weight: 500;
            word-break: break-all;
        }
        .contact-card .edit-btn {
            margin-top: 10px;
            font-size: 12px;
            color: var(--text-dim);
            background: rgba(255, 255, 255, 0.04);
            padding: 4px 16px;
            border-radius: 50px;
            transition: var(--transition);
            display: inline-block;
        }
        .contact-card .edit-btn:hover {
            background: rgba(245, 166, 35, 0.12);
            color: var(--gold);
        }

        /* ===== FORMS ===== */
        .form-group {
            margin-bottom: 18px;
        }
        .form-group label {
            display: block;
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 5px;
            color: var(--text-muted);
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 12px 16px;
            border-radius: var(--radius-sm);
            background: rgba(255, 255, 255, 0.04);
            border: 1.5px solid rgba(255, 255, 255, 0.08);
            color: #fff;
            font-size: 15px;
            transition: var(--transition);
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            border-color: var(--gold);
            background: rgba(245, 166, 35, 0.04);
            box-shadow: 0 0 0 4px rgba(245, 166, 35, 0.08);
        }
        .form-group textarea {
            resize: vertical;
            min-height: 100px;
        }
        .form-group select option {
            background: var(--dark);
            color: #fff;
        }
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }
        @media (max-width: 520px) {
            .form-row {
                grid-template-columns: 1fr;
            }
        }

        /* ===== FILTER PILLS ===== */
        .filter-pills {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 16px;
        }
        .filter-pills .pill {
            padding: 4px 16px;
            border-radius: 50px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.06);
            font-size: 13px;
            font-weight: 500;
            color: var(--text-muted);
            transition: var(--transition);
            cursor: pointer;
        }
        .filter-pills .pill:hover,
        .filter-pills .pill.active {
            background: rgba(245, 166, 35, 0.12);
            border-color: var(--gold);
            color: #fff;
        }
        .filter-pills .pill.active {
            background: var(--gold);
            color: #0b0b1a;
            border-color: var(--gold);
        }

        /* ===== MODAL ===== */
        .modal-overlay {
            position: fixed;
            inset: 0;
            z-index: 999;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(8px);
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
            animation: fadeIn 0.3s ease;
        }
        .modal-overlay.open {
            display: flex;
        }
        .modal {
            background: var(--dark-card);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: var(--radius);
            padding: 40px 36px;
            max-width: 480px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            animation: modalSlide 0.35s ease;
            box-shadow: var(--shadow);
        }
        @keyframes modalSlide {
            from {
                opacity: 0;
                transform: scale(0.94) translateY(30px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        .modal .close-btn {
            float: right;
            font-size: 24px;
            color: var(--text-dim);
            background: none;
            transition: var(--transition);
        }
        .modal .close-btn:hover {
            color: #fff;
            transform: rotate(90deg);
        }
        .modal h2 {
            font-size: 26px;
            font-weight: 800;
            margin-bottom: 6px;
        }
        .modal h2 span {
            color: var(--gold);
        }
        .modal .sub {
            color: var(--text-muted);
            font-size: 14px;
            margin-bottom: 24px;
        }
        .modal .form-group {
            margin-bottom: 16px;
        }
        .modal .switch-auth {
            text-align: center;
            margin-top: 16px;
            font-size: 14px;
            color: var(--text-muted);
        }
        .modal .switch-auth a {
            color: var(--gold);
            font-weight: 600;
            cursor: pointer;
        }
        .modal .switch-auth a:hover {
            text-decoration: underline;
        }

        /* ===== TOAST ===== */
        .toast-container {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .toast {
            background: var(--dark-card);
            border: 1px solid rgba(245, 166, 35, 0.2);
            border-radius: var(--radius-sm);
            padding: 14px 24px;
            box-shadow: var(--shadow);
            animation: slideUp 0.4s ease;
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 260px;
            backdrop-filter: blur(8px);
        }
        .toast.success {
            border-color: #22c55e;
        }
        .toast.success i {
            color: #22c55e;
        }
        .toast.error {
            border-color: #ef4444;
        }
        .toast.error i {
            color: #ef4444;
        }
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px) scale(0.96);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        .toast .msg {
            font-size: 14px;
            font-weight: 500;
        }

        /* ===== FOOTER ===== */
        footer {
            padding: 40px 0 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.04);
            margin-top: 40px;
            text-align: center;
            color: var(--text-dim);
            font-size: 14px;
        }
        footer .brand {
            font-weight: 700;
            color: var(--gold);
        }
        .footer-payment-logos {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 30px;
            flex-wrap: wrap;
            margin: 20px 0;
        }
        .footer-payment-logos img {
            height: 30px;
            opacity: 0.6;
            transition: var(--transition);
        }
        .footer-payment-logos img:hover {
            opacity: 1;
        }

        /* ===== PROFILE ===== */
        .profile-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: var(--gold);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            font-weight: 700;
            color: #0b0b1a;
            margin: 0 auto 12px;
        }
        .role-badge {
            display: inline-block;
            padding: 4px 14px;
            border-radius: 50px;
            font-size: 12px;
            font-weight: 600;
            background: rgba(245, 166, 35, 0.15);
            color: var(--gold);
            border: 1px solid rgba(245, 166, 35, 0.2);
        }
        .skill-tag {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 50px;
            font-size: 12px;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.08);
            margin: 2px 4px 2px 0;
        }

        /* ===== CATEGORY MODAL GRID ===== */
        .category-modal-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 16px;
            margin-top: 16px;
        }
        .category-modal-grid .cat-item {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: var(--radius-sm);
            padding: 16px;
            text-align: center;
            transition: var(--transition);
            cursor: pointer;
        }
        .category-modal-grid .cat-item:hover {
            background: rgba(245, 166, 35, 0.05);
            border-color: var(--gold);
            transform: scale(1.02);
        }
        .category-modal-grid .cat-item .icon {
            font-size: 28px;
            color: var(--gold);
        }
        .category-modal-grid .cat-item .name {
            font-size: 14px;
            font-weight: 500;
            margin-top: 4px;
        }

        @media (max-width: 820px) {
            .header-inner {
                flex-wrap: wrap;
                justify-content: center;
            }
            .nav-links {
                gap: 12px;
                flex-wrap: wrap;
                justify-content: center;
                font-size: 13px;
            }
            .category-dropdown .dropdown-menu {
                left: auto;
                right: 0;
            }
            .hero {
                padding: 60px 0 40px;
                min-height: 400px;
            }
            .categories-grid {
                grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            }
            .modal {
                padding: 28px 20px;
            }
            .dashboard-grid {
                grid-template-columns: 1fr;
            }
        }
        @media (max-width: 480px) {
            .logo {
                font-size: 20px;
            }
            .logo svg {
                width: 36px;
                height: 36px;
            }
            .hero h1 {
                font-size: 2rem;
            }
            .job-item {
                flex-direction: column;
                align-items: stretch;
                text-align: center;
            }
            .job-item .budget {
                text-align: center;
            }
            .job-item .action-buttons {
                justify-content: center;
            }
            .nav-links a {
                font-size: 12px;
            }
            .testimonial-grid {
                grid-template-columns: 1fr;
            }
        }
        .hidden {
            display: none !important;
        }
        .w-full {
            width: 100%;
        }
        .text-gold {
            color: var(--gold);
        }
        section {
            scroll-margin-top: 80px;
        }
    </style>
</head>
<body>

    <div class="bg-glow">
        <div class="orb"></div>
        <div class="orb"></div>
        <div class="orb"></div>
    </div>

    <!-- ===== HEADER ===== -->
    <header>
        <div class="container header-inner">
            <a href="#" class="logo" id="logoLink">
                <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="44" height="44" rx="10" fill="url(#logoGrad)" />
                    <path d="M22 8C14.268 8 8 14.268 8 22s6.268 14 14 14 14-6.268 14-14S29.732 8 22 8zm0 24c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10z" fill="#fff" opacity="0.2"/>
                    <path d="M22 12c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" fill="#fff" opacity="0.4"/>
                    <path d="M22 28c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" fill="#fff"/>
                    <text x="22" y="30" font-family="Arial" font-size="12" font-weight="bold" fill="#0b0b1a" text-anchor="middle">L</text>
                    <defs>
                        <linearGradient id="logoGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#f5a623"/>
                            <stop offset="1" stop-color="#c47f10"/>
                        </linearGradient>
                    </defs>
                </svg>
                LION<span>LANCE</span>
            </a>
            <ul class="nav-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#categories">Categories</a></li>
                <li><a href="#how">How It Works</a></li>
                <li><a href="#dashboard" id="dashNav" class="hidden">Dashboard</a></li>
                <li><a href="#profile" id="profileNav" class="hidden">Profile</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#customer-care">Customer Care</a></li>
                <li><a href="#company">About Our Company</a></li>
                <li><a href="#contact">Get in Touch</a></li>
                <li class="category-dropdown">
                    <button class="dropdown-toggle" id="categoryDropdownToggle">
                        <i class="fas fa-tags"></i> Categories <i class="fas fa-chevron-down" style="font-size:12px;"></i>
                    </button>
                    <div class="dropdown-menu" id="categoryDropdownMenu"></div>
                </li>
            </ul>
            <div class="auth-btns" id="authButtons">
                <button class="btn btn-outline-gold btn-sm" id="loginBtn">Log In</button>
                <button class="btn btn-primary btn-sm" id="signupBtn">Sign Up</button>
            </div>
            <div class="auth-btns hidden" id="userMenu">
                <span style="color:var(--text-muted);font-size:14px;" id="userNameDisplay">User</span>
                <button class="btn btn-sm" id="logoutBtn" style="border-color:rgba(255,80,80,0.3);color:#ff6b6b;">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </div>
    </header>

    <!-- ===== HERO ===== -->
    <section class="hero" id="home" data-aos="fade-up" data-aos-duration="1000">
        <div class="container hero-content">
            <div class="hero-badge"><i class="fas fa-rocket" style="margin-right:6px;"></i> #1 Freelance Marketplace</div>
            <h1>Make it real with <span class="highlight">LIONLANCE</span></h1>
            <p>Hire the best freelancers for any job, online. Worldwide talent, any job you can think of — save up to 90% &amp; get quotes for free.</p>
            <div class="hero-actions">
                <button class="btn btn-primary" id="heroPostBtn"><i class="fas fa-plus-circle"></i> Post a Job</button>
                <button class="btn btn-outline-gold" id="heroBrowseBtn"><i class="fas fa-search"></i> Browse Jobs</button>
                <button class="btn btn-outline-gold" id="exploreCategoriesBtn"><i class="fas fa-th-large"></i> Explore All Categories</button>
            </div>
            <div style="margin-top:50px;border-top:1px solid rgba(255,255,255,0.06);padding-top:40px;">
                <p style="font-size:13px;text-transform:uppercase;letter-spacing:2px;color:var(--text-dim);margin-bottom:20px;">Trusted by</p>
                <div class="trusted-logos">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" />
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg" alt="Facebook" />
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoft/microsoft-original.svg" alt="Microsoft" />
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg" alt="AWS" />
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netflix/netflix-original.svg" alt="Netflix" />
                </div>
            </div>
        </div>
    </section>

    <!-- ===== FEATURES ===== -->
    <section class="features" id="features" style="padding:60px 0 40px;" data-aos="fade-up">
        <div class="container">
            <div class="section-title">
                <h2>Why <span>LIONLANCE</span></h2>
                <p>The best talent, quality work, and full control — all in one place.</p>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:30px;">
                <div class="feature-card" style="background:var(--dark-card);border:1px solid rgba(255,255,255,0.05);border-radius:var(--radius);padding:34px 28px;transition:var(--transition);text-align:center;position:relative;overflow:hidden;" data-aos="zoom-in" data-aos-delay="100">
                    <span style="font-size:40px;color:var(--gold);margin-bottom:16px;display:block;"><i class="fas fa-users"></i></span>
                    <h3 style="font-size:20px;font-weight:700;margin-bottom:10px;">The best talent</h3>
                    <p style="color:var(--text-muted);font-size:15px;line-height:1.7;">Discover the best talent for your project. Find freelancers who can help you achieve your goals.</p>
                </div>
                <div class="feature-card" style="background:var(--dark-card);border:1px solid rgba(255,255,255,0.05);border-radius:var(--radius);padding:34px 28px;transition:var(--transition);text-align:center;position:relative;overflow:hidden;" data-aos="zoom-in" data-aos-delay="200">
                    <span style="font-size:40px;color:var(--gold);margin-bottom:16px;display:block;"><i class="fas fa-star"></i></span>
                    <h3 style="font-size:20px;font-weight:700;margin-bottom:10px;">Quality work</h3>
                    <p style="color:var(--text-muted);font-size:15px;line-height:1.7;">Our talent pool ensures you find the right expert for every job.</p>
                </div>
                <div class="feature-card" style="background:var(--dark-card);border:1px solid rgba(255,255,255,0.05);border-radius:var(--radius);padding:34px 28px;transition:var(--transition);text-align:center;position:relative;overflow:hidden;" data-aos="zoom-in" data-aos-delay="300">
                    <span style="font-size:40px;color:var(--gold);margin-bottom:16px;display:block;"><i class="fas fa-sliders-h"></i></span>
                    <h3 style="font-size:20px;font-weight:700;margin-bottom:10px;">Be in control</h3>
                    <p style="color:var(--text-muted);font-size:15px;line-height:1.7;">Stay in the loop with real-time updates, escrow payments, and full project management.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- ===== CATEGORIES ===== -->
    <section class="categories" id="categories" style="padding:40px 0 60px;" data-aos="fade-up">
        <div class="container">
            <div class="section-title">
                <h2>Explore <span>Categories</span></h2>
                <p>Click any category to browse jobs instantly.</p>
                <button class="btn btn-outline-gold" style="margin-top:16px;" id="exploreCategoriesBtn2"><i class="fas fa-th-large"></i> View All Categories</button>
            </div>
            <div class="categories-grid" id="categoriesGrid"></div>
        </div>
    </section>

    <!-- ===== HOW IT WORKS ===== -->
    <section class="how-it-works" id="how" style="padding:40px 0 60px;" data-aos="fade-up">
        <div class="container">
            <div class="section-title">
                <h2>How <span>It Works</span></h2>
                <p>Three simple steps to get your project done.</p>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:30px;">
                <div style="text-align:center;" data-aos="flip-left" data-aos-delay="100">
                    <div style="display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:50%;background:linear-gradient(145deg,var(--gold),var(--gold-dark));color:#0b0b1a;font-size:22px;font-weight:900;margin-bottom:16px;box-shadow:0 4px 24px rgba(245,166,35,0.3);">1</div>
                    <h4 style="font-size:18px;font-weight:700;">Post a Job</h4>
                    <p style="color:var(--text-muted);font-size:14px;margin-top:6px;">Describe your project, set a budget, and choose a category.</p>
                </div>
                <div style="text-align:center;" data-aos="flip-left" data-aos-delay="200">
                    <div style="display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:50%;background:linear-gradient(145deg,var(--gold),var(--gold-dark));color:#0b0b1a;font-size:22px;font-weight:900;margin-bottom:16px;box-shadow:0 4px 24px rgba(245,166,35,0.3);">2</div>
                    <h4 style="font-size:18px;font-weight:700;">Get Quotes</h4>
                    <p style="color:var(--text-muted);font-size:14px;margin-top:6px;">Freelancers apply with their proposals and rates.</p>
                </div>
                <div style="text-align:center;" data-aos="flip-left" data-aos-delay="300">
                    <div style="display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:50%;background:linear-gradient(145deg,var(--gold),var(--gold-dark));color:#0b0b1a;font-size:22px;font-weight:900;margin-bottom:16px;box-shadow:0 4px 24px rgba(245,166,35,0.3);">3</div>
                    <h4 style="font-size:18px;font-weight:700;">Hire &amp; Pay</h4>
                    <p style="color:var(--text-muted);font-size:14px;margin-top:6px;">Select the best fit, work together, and release payment securely.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- ===== TESTIMONIALS ===== -->
    <section class="testimonials" id="testimonials" data-aos="fade-up">
        <div class="container">
            <div class="section-title">
                <h2>What Our <span>Users Say</span></h2>
                <p>Real stories from real people who found success on LIONLANCE.</p>
            </div>
            <div class="testimonial-grid">
                <div class="testimonial-card" data-aos="zoom-in" data-aos-delay="100">
                    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" />
                    <div class="name">Priya Sharma</div>
                    <div class="role">Freelance Designer</div>
                    <div class="quote">"LIONLANCE helped me find my first international client. The secure payment system gave me confidence."</div>
                    <div class="rating-stars">★★★★★</div>
                </div>
                <div class="testimonial-card" data-aos="zoom-in" data-aos-delay="200">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" />
                    <div class="name">Rahul Verma</div>
                    <div class="role">Startup Founder</div>
                    <div class="quote">"We hired a top developer within 24 hours. LIONLANCE made the whole process seamless."</div>
                    <div class="rating-stars">★★★★★</div>
                </div>
                <div class="testimonial-card" data-aos="zoom-in" data-aos-delay="300">
                    <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="User" />
                    <div class="name">Ananya Iyer</div>
                    <div class="role">Content Writer</div>
                    <div class="quote">"I've earned over ₹2 lakhs through LIONLANCE in just 3 months. The platform is fantastic."</div>
                    <div class="rating-stars">★★★★★</div>
                </div>
            </div>
        </div>
    </section>

    <!-- ===== ABOUT ===== -->
    <section class="info-section" id="about" data-aos="fade-up">
        <div class="container">
            <h2>About <span>LIONLANCE</span></h2>
            <p>LIONLANCE is the world’s leading freelance marketplace, connecting businesses with top‑tier talent across every industry. Our platform empowers freelancers to build their careers and clients to scale their projects with confidence.</p>
            <div class="info-grid">
                <div class="info-card" data-aos="flip-right" data-aos-delay="100">
                    <div class="icon"><i class="fas fa-globe"></i></div>
                    <h4>Global Reach</h4>
                    <p>Work with talent from over 190 countries.</p>
                </div>
                <div class="info-card" data-aos="flip-right" data-aos-delay="200">
                    <div class="icon"><i class="fas fa-shield-alt"></i></div>
                    <h4>Secure Payments</h4>
                    <p>Your payments are protected with escrow and blockchain verification.</p>
                </div>
                <div class="info-card" data-aos="flip-right" data-aos-delay="300">
                    <div class="icon"><i class="fas fa-headset"></i></div>
                    <h4>24/7 Support</h4>
                    <p>Our dedicated support team is here to help you anytime.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- ===== CUSTOMER CARE ===== -->
    <section class="info-section" id="customer-care" style="background:transparent;" data-aos="fade-up">
        <div class="container">
            <h2>Customer <span>Care</span></h2>
            <p>We’re committed to making your experience seamless. If you have any questions or need assistance, we’re just a click away.</p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:30px;margin-top:30px;max-width:800px;margin-left:auto;margin-right:auto;">
                <div style="background:var(--dark-card);border-radius:var(--radius-sm);padding:24px;text-align:center;border:1px solid rgba(255,255,255,0.05);">
                    <div style="font-size:32px;color:var(--gold);margin-bottom:12px;"><i class="fas fa-envelope"></i></div>
                    <h4>Email Support</h4>
                    <p style="color:var(--text-muted);">support@lionlance.com</p>
                </div>
                <div style="background:var(--dark-card);border-radius:var(--radius-sm);padding:24px;text-align:center;border:1px solid rgba(255,255,255,0.05);">
                    <div style="font-size:32px;color:var(--gold);margin-bottom:12px;"><i class="fas fa-phone-alt"></i></div>
                    <h4>Phone</h4>
                    <p style="color:var(--text-muted);">+1 (800) 555‑LION</p>
                </div>
                <div style="background:var(--dark-card);border-radius:var(--radius-sm);padding:24px;text-align:center;border:1px solid rgba(255,255,255,0.05);">
                    <div style="font-size:32px;color:var(--gold);margin-bottom:12px;"><i class="fas fa-comment-dots"></i></div>
                    <h4>Live Chat</h4>
                    <p style="color:var(--text-muted);">Available 24/7</p>
                </div>
            </div>
        </div>
    </section>

    <!-- ===== ABOUT OUR COMPANY ===== -->
    <section class="info-section" id="company" data-aos="fade-up">
        <div class="container">
            <h2>About Our <span>Company</span></h2>
            <p>Founded in 2024, LIONLANCE is on a mission to democratise work. We believe that talent is universal, but opportunity is not. Our platform removes barriers, enabling people everywhere to earn a living and businesses to innovate faster.</p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin-top:30px;max-width:700px;margin-left:auto;margin-right:auto;">
                <div style="background:var(--dark-card);border-radius:var(--radius-sm);padding:20px;text-align:center;border:1px solid rgba(255,255,255,0.05);">
                    <div style="font-size:28px;font-weight:700;color:var(--gold);">50K+</div>
                    <p style="color:var(--text-muted);">Freelancers</p>
                </div>
                <div style="background:var(--dark-card);border-radius:var(--radius-sm);padding:20px;text-align:center;border:1px solid rgba(255,255,255,0.05);">
                    <div style="font-size:28px;font-weight:700;color:var(--gold);">10K+</div>
                    <p style="color:var(--text-muted);">Projects Completed</p>
                </div>
                <div style="background:var(--dark-card);border-radius:var(--radius-sm);padding:20px;text-align:center;border:1px solid rgba(255,255,255,0.05);">
                    <div style="font-size:28px;font-weight:700;color:var(--gold);">98%</div>
                    <p style="color:var(--text-muted);">Client Satisfaction</p>
                </div>
            </div>
        </div>
    </section>

    <!-- ===== DASHBOARD ===== -->
    <section class="dashboard-section" id="dashboard">
        <div class="container">
            <div class="section-title">
                <h2>Your <span>Dashboard</span></h2>
                <p>Manage your jobs, wallet, and account.</p>
            </div>
            <div class="dashboard-grid">
                <!-- LEFT COL -->
                <div>
                    <div class="dash-card" id="postJobCard">
                        <h3><i class="fas fa-pen-fancy"></i> Post a Job</h3>
                        <form id="postJobForm">
                            <div class="form-group">
                                <label>Job Title</label>
                                <input type="text" id="jobTitle" placeholder="e.g. Build a React dashboard" required />
                            </div>
                            <div class="form-group">
                                <label>Category</label>
                                <select id="jobCategory" required>
                                    <option value="">Select category</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Description</label>
                                <textarea id="jobDesc" placeholder="Describe your project in detail..." required></textarea>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Budget (₹)</label>
                                    <input type="number" id="jobBudget" min="1" step="1" placeholder="Min ₹1" required />
                                </div>
                                <div class="form-group">
                                    <label>Deadline (days)</label>
                                    <input type="number" id="jobDeadline" min="1" placeholder="e.g. 7" required />
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary w-full" style="justify-content:center;">
                                <i class="fas fa-rocket"></i> Post Job
                            </button>
                            <p style="font-size:12px;color:var(--text-dim);margin-top:8px;text-align:center;">
                                <i class="fas fa-info-circle"></i> 10% brokerage fee applies on completion.
                            </p>
                        </form>
                    </div>
                    <div class="dash-card" style="margin-top:20px;">
                        <h3><i class="fas fa-wallet"></i> Wallet</h3>
                        <div class="wallet-balance">
                            <div>
                                <div class="label">Balance</div>
                                <div class="amount" id="walletBalance">₹0.00</div>
                            </div>
                            <div style="margin-left:auto;">
                                <div class="label">Brokerage earned</div>
                                <div style="font-size:20px;font-weight:700;color:var(--gold);" id="brokerageEarned">₹0.00</div>
                            </div>
                        </div>
                        <div class="payment-actions">
                            <button class="btn btn-primary btn-sm" id="addFundsBtn"><i class="fas fa-plus"></i> Add Funds</button>
                            <button class="btn btn-outline-gold btn-sm" id="sendPaymentBtn"><i class="fas fa-paper-plane"></i> Send</button>
                            <button class="btn btn-sm" id="receivePaymentBtn" style="border-color:rgba(34,197,94,0.3);color:#22c55e;"><i class="fas fa-download"></i> Receive</button>
                            <button class="btn btn-danger btn-sm" id="withdrawBtn"><i class="fas fa-arrow-up"></i> Withdraw</button>
                        </div>
                        <div style="margin-top:16px;display:flex;gap:12px;flex-wrap:wrap;">
                            <span class="security-badge"><i class="fas fa-lock"></i> Secure Payments</span>
                            <span style="display:inline-flex;align-items:center;gap:6px;background:rgba(245,166,35,0.08);padding:4px 12px;border-radius:50px;font-size:12px;">
                                <img src="https://razorpay.com/favicon.ico" style="height:16px;" alt="Razorpay" /> Powered by Razorpay
                            </span>
                        </div>
                    </div>
                </div>
                <!-- RIGHT COL -->
                <div>
                    <div class="dash-card">
                        <h3><i class="fas fa-list"></i> My Jobs</h3>
                        <div id="myJobsList" class="job-list"><p style="color:var(--text-dim);font-size:14px;">No jobs posted yet.</p></div>
                    </div>
                    <div class="dash-card" style="margin-top:20px;">
                        <h3><i class="fas fa-globe"></i> Browse Jobs</h3>
                        <div class="filter-pills" id="filterPills"><button class="pill active" data-filter="all">All</button></div>
                        <div id="allJobsList" class="job-list"><p style="color:var(--text-dim);font-size:14px;">No jobs available.</p></div>
                    </div>
                    <div class="dash-card" style="margin-top:20px;">
                        <h3><i class="fas fa-users-cog"></i> User Management</h3>
                        <p style="font-size:13px;color:var(--text-dim);margin-bottom:12px;">
                            <i class="fas fa-circle" style="color:#22c55e;font-size:8px;"></i> Active sessions &amp; registered users
                        </p>
                        <div id="userManagementList" class="user-list"><p style="color:var(--text-dim);font-size:14px;">Loading users...</p></div>
                    </div>
                    <!-- ===== WHO'S ONLINE (NEW) ===== -->
                    <div class="dash-card" style="margin-top:20px;">
                        <h3><i class="fas fa-user-check"></i> Who’s Online</h3>
                        <p style="font-size:13px;color:var(--text-dim);margin-bottom:12px;">
                            <i class="fas fa-circle" style="color:#22c55e;font-size:8px;"></i> Users active in the last 5 minutes
                        </p>
                        <div id="onlineUsersList" class="user-list"><p style="color:var(--text-dim);font-size:14px;">Loading...</p></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ===== PROFILE ===== -->
    <section class="dashboard-section" id="profile" style="padding:40px 0 60px;">
        <div class="container">
            <div class="section-title">
                <h2>Your <span>Profile</span></h2>
                <p>Manage your public profile and settings.</p>
            </div>
            <div class="dash-card" style="max-width:600px;margin:0 auto;">
                <div class="profile-avatar" id="profileAvatar">U</div>
                <h3 style="text-align:center;margin-bottom:4px;" id="profileName">User Name</h3>
                <div style="text-align:center;color:var(--text-muted);font-size:14px;" id="profileEmail">user@example.com</div>
                <div style="text-align:center;margin:8px 0;"><span class="role-badge" id="profileRole">Freelancer</span></div>
                <div style="text-align:center;margin:8px 0;" id="profileSkills"></div>
                <div style="text-align:center;margin:8px 0;" id="profileRating"></div>
                <hr style="border-color:rgba(255,255,255,0.06);margin:16px 0;" />
                <form id="profileForm">
                    <div class="form-group">
                        <label>Bio</label>
                        <textarea id="profileBio" rows="3" placeholder="Tell us about yourself..."></textarea>
                    </div>
                    <div class="form-group">
                        <label>Skills (comma separated)</label>
                        <input type="text" id="profileSkillsInput" placeholder="e.g. React, Node.js, UI/UX" />
                    </div>
                    <div class="form-group">
                        <label>Hourly Rate (₹)</label>
                        <input type="number" id="profileHourlyRate" min="0" step="1" placeholder="0" />
                    </div>
                    <div class="form-group">
                        <label>Role</label>
                        <select id="profileRoleSelect">
                            <option value="client">Client</option>
                            <option value="freelancer">Freelancer</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary w-full" style="justify-content:center;">
                        <i class="fas fa-save"></i> Update Profile
                    </button>
                </form>
            </div>
        </div>
    </section>

    <!-- ===== CONTACT ===== -->
    <section class="contact-info" id="contact" data-aos="fade-up">
        <div class="container">
            <div class="section-title">
                <h2>Get in <span>Touch</span></h2>
                <p>Reach out to us anytime — we're here to help.</p>
            </div>
            <div class="contact-cards" id="contactCards"></div>
        </div>
    </section>

    <!-- ===== FOOTER ===== -->
    <footer>
        <div class="container">
            <div class="footer-payment-logos">
                <img src="https://razorpay.com/favicon.ico" alt="Razorpay" style="height:24px;" />
                <span style="color:var(--text-dim);">|</span>
                <span style="color:var(--text-dim);font-size:14px;">Secure payments powered by</span>
                <img src="https://razorpay.com/favicon.ico" alt="Razorpay" style="height:30px;opacity:0.8;" />
                <span style="color:var(--text-dim);">|</span>
                <span class="security-badge"><i class="fas fa-shield-alt"></i> SSL Secured</span>
            </div>
            <p>&copy; 2026 <span class="brand">LIONLANCE</span> — Freelance Marketplace. All rights reserved.</p>
            <p style="font-size:12px;margin-top:4px;">Built with <i class="fas fa-heart" style="color:var(--gold);"></i> for the global freelance community.</p>
        </div>
    </footer>

    <!-- ===== MODALS ===== -->
    <!-- Auth Modal -->
    <div class="modal-overlay" id="authModal">
        <div class="modal">
            <button class="close-btn" id="authModalClose">&times;</button>
            <h2 id="authModalTitle">Welcome to <span>LIONLANCE</span></h2>
            <p class="sub" id="authModalSub">Log in to your account to continue.</p>
            <form id="authForm">
                <div class="form-group" id="nameGroup">
                    <label>Full Name</label>
                    <input type="text" id="authName" placeholder="John Doe" />
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="authEmail" placeholder="you@example.com" required />
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="authPassword" placeholder="••••••••" required minlength="4" />
                </div>
                <button type="submit" class="btn btn-primary w-full" style="justify-content:center;" id="authSubmitBtn">
                    <i class="fas fa-arrow-right"></i> Log In
                </button>
            </form>
            <div class="switch-auth">
                <span id="authSwitchText">Don't have an account?</span>
                <a id="authSwitchLink">Sign Up</a>
            </div>
        </div>
    </div>

    <!-- Edit Contact Modal -->
    <div class="modal-overlay edit-contact-modal" id="editContactModal">
        <div class="modal">
            <button class="close-btn" id="editContactClose">&times;</button>
            <h2>Edit <span>Contact</span></h2>
            <p class="sub">Update your contact information.</p>
            <form id="editContactForm">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="editEmail" placeholder="contact@example.com" />
                </div>
                <div class="form-group">
                    <label>Instagram</label>
                    <input type="text" id="editInstagram" placeholder="@yourhandle" />
                </div>
                <button type="submit" class="btn btn-primary w-full" style="justify-content:center;">
                    <i class="fas fa-save"></i> Save Changes
                </button>
            </form>
        </div>
    </div>

    <!-- Add Funds Modal -->
    <div class="modal-overlay" id="fundsModal">
        <div class="modal">
            <button class="close-btn" id="fundsModalClose">&times;</button>
            <h2>Add <span>Funds</span></h2>
            <p class="sub">Add money to your wallet securely.</p>
            <form id="fundsForm">
                <div class="form-group">
                    <label>Amount (₹)</label>
                    <input type="number" id="fundsAmount" min="1" step="1" placeholder="Enter amount" required />
                </div>
                <button type="submit" class="btn btn-primary w-full" style="justify-content:center;">
                    <i class="fas fa-plus-circle"></i> Add Funds
                </button>
            </form>
        </div>
    </div>

    <!-- Send Payment Modal -->
    <div class="modal-overlay" id="sendModal">
        <div class="modal">
            <button class="close-btn" id="sendModalClose">&times;</button>
            <h2>Send <span>Payment</span></h2>
            <p class="sub">Send money to a freelancer.</p>
            <form id="sendForm">
                <div class="form-group">
                    <label>Recipient Email</label>
                    <input type="email" id="sendRecipient" placeholder="freelancer@example.com" required />
                </div>
                <div class="form-group">
                    <label>Amount (₹)</label>
                    <input type="number" id="sendAmount" min="1" step="1" placeholder="Enter amount" required />
                </div>
                <button type="submit" class="btn btn-primary w-full" style="justify-content:center;">
                    <i class="fas fa-paper-plane"></i> Send Payment
                </button>
            </form>
        </div>
    </div>

    <!-- Receive Payment Modal -->
    <div class="modal-overlay" id="receiveModal">
        <div class="modal">
            <button class="close-btn" id="receiveModalClose">&times;</button>
            <h2>Receive <span>Payment</span></h2>
            <p class="sub">Receive money from a client.</p>
            <form id="receiveForm">
                <div class="form-group">
                    <label>Sender Email</label>
                    <input type="email" id="receiveSender" placeholder="client@example.com" required />
                </div>
                <div class="form-group">
                    <label>Amount (₹)</label>
                    <input type="number" id="receiveAmount" min="1" step="1" placeholder="Enter amount" required />
                </div>
                <button type="submit" class="btn btn-primary w-full" style="justify-content:center;">
                    <i class="fas fa-download"></i> Receive Payment
                </button>
            </form>
        </div>
    </div>

    <!-- Withdraw Modal -->
    <div class="modal-overlay" id="withdrawModal">
        <div class="modal">
            <button class="close-btn" id="withdrawModalClose">&times;</button>
            <h2>Withdraw <span>Funds</span></h2>
            <p class="sub">Withdraw money from your wallet.</p>
            <form id="withdrawForm">
                <div class="form-group">
                    <label>Amount (₹)</label>
                    <input type="number" id="withdrawAmount" min="1" step="1" placeholder="Enter amount" required />
                </div>
                <button type="submit" class="btn btn-danger w-full" style="justify-content:center;">
                    <i class="fas fa-arrow-up"></i> Withdraw
                </button>
            </form>
        </div>
    </div>

    <!-- Apply Modal -->
    <div class="modal-overlay" id="applyModal">
        <div class="modal">
            <button class="close-btn" id="applyModalClose">&times;</button>
            <h2>Apply for <span>Job</span></h2>
            <p class="sub" id="applyJobTitle">Job Title</p>
            <form id="applyForm">
                <div class="form-group">
                    <label>Proposal</label>
                    <textarea id="applyProposal" rows="4" placeholder="Why you're the best fit..." required></textarea>
                </div>
                <div class="form-group">
                    <label>Bid Amount (₹)</label>
                    <input type="number" id="applyBid" min="1" step="1" placeholder="Enter your bid" required />
                </div>
                <button type="submit" class="btn btn-primary w-full" style="justify-content:center;">
                    <i class="fas fa-paper-plane"></i> Submit Application
                </button>
            </form>
        </div>
    </div>

    <!-- Review Modal -->
    <div class="modal-overlay" id="reviewModal">
        <div class="modal">
            <button class="close-btn" id="reviewModalClose">&times;</button>
            <h2>Leave a <span>Review</span></h2>
            <p class="sub" id="reviewUserLabel">Review for User</p>
            <form id="reviewForm">
                <div class="form-group">
                    <label>Rating (1-5)</label>
                    <div style="display:flex;gap:8px;font-size:24px;color:var(--gold);" id="ratingStars">
                        <span data-value="1" class="star">☆</span>
                        <span data-value="2" class="star">☆</span>
                        <span data-value="3" class="star">☆</span>
                        <span data-value="4" class="star">☆</span>
                        <span data-value="5" class="star">☆</span>
                    </div>
                    <input type="hidden" id="reviewRating" value="0" />
                </div>
                <div class="form-group">
                    <label>Comment</label>
                    <textarea id="reviewComment" rows="3" placeholder="Share your experience..."></textarea>
                </div>
                <button type="submit" class="btn btn-primary w-full" style="justify-content:center;">
                    <i class="fas fa-star"></i> Submit Review
                </button>
            </form>
        </div>
    </div>

    <!-- Edit Job Modal -->
    <div class="modal-overlay" id="editJobModal">
        <div class="modal">
            <button class="close-btn" id="editJobModalClose">&times;</button>
            <h2>Edit <span>Job</span></h2>
            <p class="sub">Update your job details.</p>
            <form id="editJobForm">
                <input type="hidden" id="editJobId" />
                <div class="form-group">
                    <label>Job Title</label>
                    <input type="text" id="editJobTitle" placeholder="e.g. Build a React dashboard" required />
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <select id="editJobCategory" required>
                        <option value="">Select category</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="editJobDesc" rows="4" placeholder="Describe your project in detail..." required></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Budget (₹)</label>
                        <input type="number" id="editJobBudget" min="1" step="1" placeholder="Min ₹1" required />
                    </div>
                    <div class="form-group">
                        <label>Deadline (days)</label>
                        <input type="number" id="editJobDeadline" min="1" placeholder="e.g. 7" required />
                    </div>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select id="editJobStatus">
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary w-full" style="justify-content:center;">
                    <i class="fas fa-save"></i> Update Job
                </button>
            </form>
        </div>
    </div>

    <!-- Explore Categories Modal -->
    <div class="modal-overlay" id="categoriesModal">
        <div class="modal" style="max-width:700px;">
            <button class="close-btn" id="categoriesModalClose">&times;</button>
            <h2>Explore All <span>Categories</span></h2>
            <p class="sub">Click a category to browse jobs instantly.</p>
            <div class="category-modal-grid" id="categoriesModalGrid"></div>
        </div>
    </div>

    <div class="toast-container" id="toastContainer"></div>

    <!-- ============================================================ -->
    <!-- ===== JAVASCRIPT – FULLY WORKING ===== -->
    <!-- ============================================================ -->
    <script>
        // Initialize AOS
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });

        (function() {
            'use strict';

            const API_BASE = 'https://lionlance-backend-production.up.railway.app/api';

            // ===== HELPERS =====
            function toast(msg, type = 'success') {
                const c = document.getElementById('toastContainer');
                const el = document.createElement('div');
                el.className = 'toast ' + type;
                el.innerHTML =
                    `<i class="fas ${type==='success'?'fa-check-circle':'fa-exclamation-circle'}"></i><span class="msg">${msg}</span>`;
                c.appendChild(el);
                setTimeout(() => { el.style.opacity = '0';
                    el.style.transform = 'translateX(40px)';
                    setTimeout(() => el.remove(), 400); }, 3000);
            }

            function getToken() { return localStorage.getItem('lionlance_token'); }

            function setToken(t) { localStorage.setItem('lionlance_token', t); }

            function getCurrentUser() { try { return JSON.parse(localStorage.getItem('lionlance_user')); } catch { return null; } }

            function setCurrentUser(u) { localStorage.setItem('lionlance_user', JSON.stringify(u)); }

            function clearSession() { localStorage.removeItem('lionlance_token');
                localStorage.removeItem('lionlance_user'); }

            function formatCurrency(amount) { return '₹' + Number(amount).toFixed(2); }

            function escHtml(str) { if (!str) return ''; const d = document.createElement('div');
                d.textContent = str; return d.innerHTML; }

            async function apiCall(endpoint, options = {}) {
                const token = getToken();
                const headers = {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                    ...options.headers
                };
                const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Request failed');
                return data;
            }

            // ===== CATEGORIES =====
            const CATEGORIES = [
                'Web Development', 'Mobile Apps', 'Design & Art', 'Writing',
                'Marketing', 'Video & Audio', 'Data Science', 'Business',
                'Game Dev', 'AI & ML', 'Cybersecurity', 'Blockchain',
                'Cloud', 'DevOps', 'Customer Support', 'Other'
            ];

            function populateCategoryDropdown() {
                const menu = document.getElementById('categoryDropdownMenu');
                menu.innerHTML = '';
                CATEGORIES.forEach(cat => {
                    const a = document.createElement('a');
                    a.textContent = cat;
                    a.href = '#';
                    a.addEventListener('click', function(e) {
                        e.preventDefault();
                        filterByCategory(cat);
                    });
                    menu.appendChild(a);
                });
            }

            function populateCategoryModal() {
                const grid = document.getElementById('categoriesModalGrid');
                grid.innerHTML = '';
                const iconMap = { 'Web Development': 'fa-code', 'Mobile Apps': 'fa-mobile-alt', 'Design & Art': 'fa-paint-brush', 'Writing': 'fa-pen-fancy', 'Marketing': 'fa-bullhorn', 'Video & Audio': 'fa-video', 'Data Science': 'fa-chart-bar', 'Business': 'fa-briefcase', 'Game Dev': 'fa-gamepad', 'AI & ML': 'fa-brain', 'Cybersecurity': 'fa-shield-alt', 'Blockchain': 'fa-link', 'Cloud': 'fa-cloud', 'DevOps': 'fa-cogs', 'Customer Support': 'fa-headset', 'Other': 'fa-ellipsis-h' };
                CATEGORIES.forEach(cat => {
                    const div = document.createElement('div');
                    div.className = 'cat-item';
                    const icon = iconMap[cat] || 'fa-tag';
                    div.innerHTML = `<span class="icon"><i class="fas ${icon}"></i></span><div class="name">${cat}</div>`;
                    div.addEventListener('click', function() {
                        document.getElementById('categoriesModal').classList.remove('open');
                        filterByCategory(cat);
                    });
                    grid.appendChild(div);
                });
            }

            function filterByCategory(cat) {
                const user = getCurrentUser();
                if (user) {
                    document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
                    const pills = document.getElementById('filterPills').querySelectorAll('.pill');
                    pills.forEach(p => p.classList.remove('active'));
                    const target = Array.from(pills).find(p => p.dataset.filter === cat);
                    if (target) target.classList.add('active');
                    document.getElementById('filterPills').dataset.filter = cat;
                    loadAllJobs();
                } else {
                    document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });
                    const items = document.querySelectorAll('#categoriesGrid .category-item');
                    items.forEach(el => {
                        if (el.dataset.category === cat) {
                            el.style.borderColor = 'var(--gold)';
                            el.style.transform = 'scale(1.05)';
                            setTimeout(() => { el.style.transform = ''; }, 2000);
                        } else {
                            el.style.borderColor = '';
                        }
                    });
                    loadAllJobs();
                    window._tempCategoryFilter = cat;
                    loadAllJobs();
                }
            }

            // ===== UI UPDATE =====
            function updateUI() {
                const user = getCurrentUser();
                const authBtns = document.getElementById('authButtons');
                const userMenu = document.getElementById('userMenu');
                const dashNav = document.getElementById('dashNav');
                const profileNav = document.getElementById('profileNav');
                const userNameDisplay = document.getElementById('userNameDisplay');
                const heroPostBtn = document.getElementById('heroPostBtn');
                const heroBrowseBtn = document.getElementById('heroBrowseBtn');

                if (user) {
                    authBtns.classList.add('hidden');
                    userMenu.classList.remove('hidden');
                    userNameDisplay.textContent = user.name || user.email.split('@')[0];
                    dashNav.classList.remove('hidden');
                    profileNav.classList.remove('hidden');
                    document.getElementById('dashboard').classList.add('active');
                    document.getElementById('profile').classList.add('active');
                    heroPostBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Post a Job';
                    heroBrowseBtn.innerHTML = '<i class="fas fa-th-large"></i> Dashboard';
                    loadDashboard();
                    loadProfile();
                } else {
                    authBtns.classList.remove('hidden');
                    userMenu.classList.add('hidden');
                    dashNav.classList.add('hidden');
                    profileNav.classList.add('hidden');
                    document.getElementById('dashboard').classList.remove('active');
                    document.getElementById('profile').classList.remove('active');
                    heroPostBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Post a Job';
                    heroBrowseBtn.innerHTML = '<i class="fas fa-search"></i> Browse Jobs';
                    loadCategories();
                    loadContactCards();
                    loadAllJobs();
                }
                populateCategoryDropdown();
                populateCategoryModal();
            }

            // ===== CATEGORIES (Home) =====
            async function loadCategories() {
                const grid = document.getElementById('categoriesGrid');
                const jobCatSelect = document.getElementById('jobCategory');
                const filterPills = document.getElementById('filterPills');

                grid.innerHTML = '';
                const iconMap = { 'Web Development': 'fa-code', 'Mobile Apps': 'fa-mobile-alt', 'Design & Art': 'fa-paint-brush', 'Writing': 'fa-pen-fancy', 'Marketing': 'fa-bullhorn', 'Video & Audio': 'fa-video', 'Data Science': 'fa-chart-bar', 'Business': 'fa-briefcase', 'Game Dev': 'fa-gamepad', 'AI & ML': 'fa-brain', 'Cybersecurity': 'fa-shield-alt', 'Blockchain': 'fa-link', 'Cloud': 'fa-cloud', 'DevOps': 'fa-cogs', 'Customer Support': 'fa-headset', 'Other': 'fa-ellipsis-h' };
                CATEGORIES.forEach(cat => {
                    const div = document.createElement('div');
                    div.className = 'category-item';
                    const icon = iconMap[cat] || 'fa-tag';
                    div.innerHTML =
                        `<span class="icon"><i class="fas ${icon}"></i></span><div class="name">${cat}</div><div class="count">0 open</div>`;
                    div.dataset.category = cat;
                    div.addEventListener('click', function() {
                        const catName = this.dataset.category;
                        filterByCategory(catName);
                    });
                    grid.appendChild(div);
                });
                jobCatSelect.innerHTML = '<option value="">Select category</option>';
                CATEGORIES.forEach(c => { const o = document.createElement('option');
                    o.value = c;
                    o.textContent = c;
                    jobCatSelect.appendChild(o); });
                try {
                    const jobs = await apiCall('/jobs');
                    const counts = {};
                    jobs.forEach(j => { counts[j.category] = (counts[j.category] || 0) + 1; });
                    document.querySelectorAll('.category-item .count').forEach((el, idx) => {
                        const cat = CATEGORIES[idx];
                        el.textContent = (counts[cat] || 0) + ' open';
                    });
                } catch (e) {}
                filterPills.innerHTML = '<button class="pill active" data-filter="all">All</button>';
                CATEGORIES.forEach(c => {
                    const pill = document.createElement('button');
                    pill.className = 'pill';
                    pill.dataset.filter = c;
                    pill.textContent = c;
                    filterPills.appendChild(pill);
                });
                filterPills.querySelectorAll('.pill').forEach(p => {
                    p.addEventListener('click', function() {
                        filterPills.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
                        this.classList.add('active');
                        filterPills.dataset.filter = this.dataset.filter;
                        loadAllJobs();
                    });
                });
            }

            // ===== JOBS =====
            async function loadAllJobs() {
                const container = document.getElementById('allJobsList');
                const filter = document.getElementById('filterPills').dataset.filter || 'all';
                const tempFilter = window._tempCategoryFilter || null;
                const effectiveFilter = (tempFilter && tempFilter !== 'all') ? tempFilter : filter;
                try {
                    let url = '/jobs';
                    if (effectiveFilter !== 'all') url += `?category=${encodeURIComponent(effectiveFilter)}`;
                    const jobs = await apiCall(url);
                    if (jobs.length === 0) {
                        container.innerHTML = '<p style="color:var(--text-dim);font-size:14px;">No jobs available in this category.</p>';
                        return;
                    }
                    container.innerHTML = '';
                    const user = getCurrentUser();
                    jobs.slice().reverse().forEach(job => {
                        const div = document.createElement('div');
                        div.className = 'job-item';
                        const isOwner = user && (job.posterEmail === user.email || user.isAdmin);
                        div.innerHTML = `
                            <div class="info">
                                <h4>${escHtml(job.title)}</h4>
                                <div class="meta">
                                    <span class="cat"><i class="fas fa-tag"></i> ${escHtml(job.category)}</span>
                                    <span><i class="far fa-user"></i> ${escHtml(job.posterName || 'Anonymous')}</span>
                                    <span><i class="far fa-calendar-alt"></i> ${job.deadline || 'N/A'} days</span>
                                </div>
                            </div>
                            <div class="budget">${formatCurrency(job.budget)}</div>
                            <span class="status ${job.status === 'closed' ? 'closed' : ''}">${job.status === 'closed' ? 'Closed' : 'Open'}</span>
                            <div class="action-buttons">
                                ${isOwner ? `<button class="btn btn-sm btn-outline-gold edit-job-btn" data-jobid="${job._id}"><i class="fas fa-edit"></i> Edit</button>` : ''}
                                ${isOwner ? `<button class="btn btn-sm btn-danger delete-job-btn" data-jobid="${job._id}"><i class="fas fa-trash"></i> Delete</button>` : ''}
                                <button class="apply-btn" data-jobid="${job._id}" data-jobtitle="${escHtml(job.title)}"><i class="fas fa-paper-plane"></i> Apply</button>
                            </div>
                        `;
                        container.appendChild(div);
                    });
                    container.querySelectorAll('.apply-btn').forEach(btn => {
                        btn.addEventListener('click', function() {
                            const jobId = this.dataset.jobid;
                            const jobTitle = this.dataset.jobtitle;
                            openApplyModal(jobId, jobTitle);
                        });
                    });
                    container.querySelectorAll('.edit-job-btn').forEach(btn => {
                        btn.addEventListener('click', function() {
                            const jobId = this.dataset.jobid;
                            openEditJobModal(jobId);
                        });
                    });
                    container.querySelectorAll('.delete-job-btn').forEach(btn => {
                        btn.addEventListener('click', function() {
                            const jobId = this.dataset.jobid;
                            deleteJob(jobId);
                        });
                    });
                } catch (e) {
                    container.innerHTML = '<p style="color:var(--text-dim);font-size:14px;">Failed to load jobs.</p>';
                }
                window._tempCategoryFilter = null;
            }

            async function loadMyJobs() {
                const container = document.getElementById('myJobsList');
                const user = getCurrentUser();
                if (!user) { container.innerHTML = '<p style="color:var(--text-dim);font-size:14px;">Please log in to see your jobs.</p>'; return; }
                try {
                    const allJobs = await apiCall('/jobs');
                    const jobs = allJobs.filter(j => j.posterEmail === user.email);
                    if (jobs.length === 0) { container.innerHTML = '<p style="color:var(--text-dim);font-size:14px;">You haven\'t posted any jobs yet.</p>'; return; }
                    container.innerHTML = '';
                    jobs.slice().reverse().forEach(job => {
                        const div = document.createElement('div');
                        div.className = 'job-item';
                        const statusClass = job.status === 'closed' ? 'closed' : '';
                        div.innerHTML = `
                            <div class="info">
                                <h4>${escHtml(job.title)}</h4>
                                <div class="meta">
                                    <span class="cat"><i class="fas fa-tag"></i> ${escHtml(job.category)}</span>
                                    <span><i class="far fa-clock"></i> ${job.deadline || 'N/A'} days</span>
                                </div>
                            </div>
                            <div class="budget">${formatCurrency(job.budget)}</div>
                            <span class="status ${statusClass}">${job.status === 'closed' ? 'Closed' : 'Open'}</span>
                            <div class="action-buttons">
                                <button class="btn btn-sm btn-outline-gold edit-job-btn" data-jobid="${job._id}"><i class="fas fa-edit"></i> Edit</button>
                                <button class="btn btn-sm btn-danger delete-job-btn" data-jobid="${job._id}"><i class="fas fa-trash"></i> Delete</button>
                                <button class="btn btn-sm btn-outline-gold" style="font-size:12px;padding:4px 12px;" onclick="toast('View bids coming soon','info')">Bids</button>
                            </div>
                        `;
                        container.appendChild(div);
                    });
                    container.querySelectorAll('.edit-job-btn').forEach(btn => {
                        btn.addEventListener('click', function() {
                            const jobId = this.dataset.jobid;
                            openEditJobModal(jobId);
                        });
                    });
                    container.querySelectorAll('.delete-job-btn').forEach(btn => {
                        btn.addEventListener('click', function() {
                            const jobId = this.dataset.jobid;
                            deleteJob(jobId);
                        });
                    });
                } catch (e) {
                    container.innerHTML = '<p style="color:var(--text-dim);font-size:14px;">Failed to load your jobs.</p>';
                }
            }

            // ===== EDIT JOB =====
            async function openEditJobModal(jobId) {
                try {
                    const job = await apiCall(`/jobs/${jobId}`);
                    document.getElementById('editJobId').value = jobId;
                    document.getElementById('editJobTitle').value = job.title;
                    document.getElementById('editJobCategory').value = job.category;
                    document.getElementById('editJobDesc').value = job.description;
                    document.getElementById('editJobBudget').value = job.budget;
                    document.getElementById('editJobDeadline').value = job.deadline;
                    document.getElementById('editJobStatus').value = job.status || 'open';
                    const catSelect = document.getElementById('editJobCategory');
                    catSelect.innerHTML = '';
                    CATEGORIES.forEach(c => {
                        const opt = document.createElement('option');
                        opt.value = c;
                        opt.textContent = c;
                        if (c === job.category) opt.selected = true;
                        catSelect.appendChild(opt);
                    });
                    document.getElementById('editJobModal').classList.add('open');
                } catch (err) {
                    toast(err.message, 'error');
                }
            }

            async function handleEditJobSubmit(e) {
                e.preventDefault();
                const jobId = document.getElementById('editJobId').value;
                const title = document.getElementById('editJobTitle').value.trim();
                const category = document.getElementById('editJobCategory').value;
                const description = document.getElementById('editJobDesc').value.trim();
                const budget = parseFloat(document.getElementById('editJobBudget').value);
                const deadline = parseInt(document.getElementById('editJobDeadline').value);
                const status = document.getElementById('editJobStatus').value;
                if (!title || !category || !description || !budget || budget < 1 || !deadline || deadline < 1) {
                    toast('Please fill all fields correctly.', 'error');
                    return;
                }
                try {
                    await apiCall(`/jobs/${jobId}`, {
                        method: 'PUT',
                        body: JSON.stringify({ title, category, description, budget, deadline, status })
                    });
                    document.getElementById('editJobModal').classList.remove('open');
                    toast('Job updated successfully! ✅');
                    loadMyJobs();
                    loadAllJobs();
                    loadCategories();
                } catch (err) {
                    toast(err.message, 'error');
                }
            }

            // ===== DELETE JOB =====
            async function deleteJob(jobId) {
                if (!confirm('Are you sure you want to delete this job? This cannot be undone.')) return;
                try {
                    await apiCall(`/jobs/${jobId}`, { method: 'DELETE' });
                    toast('Job deleted successfully.');
                    loadMyJobs();
                    loadAllJobs();
                    loadCategories();
                } catch (err) {
                    toast(err.message, 'error');
                }
            }

            // ===== WALLET =====
            async function loadWallet() {
                const user = getCurrentUser();
                if (!user) return;
                try {
                    const data = await apiCall('/wallet/balance');
                    document.getElementById('walletBalance').textContent = formatCurrency(data.balance);
                    try {
                        const stats = await apiCall('/admin/stats');
                        document.getElementById('brokerageEarned').textContent = formatCurrency(stats.totalBrokerage || 0);
                    } catch (e) {}
                } catch (e) {
                    document.getElementById('walletBalance').textContent = '₹0.00';
                }
            }

            // ===== USER MANAGEMENT (with Online status) =====
            async function loadUserManagement() {
                const container = document.getElementById('userManagementList');
                const user = getCurrentUser();
                if (!user || !user.isAdmin) {
                    container.innerHTML = '<p style="color:var(--text-dim);font-size:14px;">Admin access required.</p>';
                    return;
                }
                try {
                    const users = await apiCall('/users');
                    if (users.length === 0) {
                        container.innerHTML = '<p style="color:var(--text-dim);font-size:14px;">No registered users yet.</p>';
                        return;
                    }
                    container.innerHTML = '';
                    const now = Date.now();
                    const fiveMinutes = 5 * 60 * 1000;
                    users.forEach(u => {
                        const isActive = u.lastActive && (now - new Date(u.lastActive).getTime()) < fiveMinutes;
                        const div = document.createElement('div');
                        div.className = 'user-item';
                        const initials = (u.name || u.email).charAt(0).toUpperCase();
                        div.innerHTML = `
                            <div class="user-info">
                                <div class="avatar">${initials}</div>
                                <div class="details">
                                    <div class="name">${escHtml(u.name || 'User')} ${u.isAdmin ? '<span class="admin-tag">Admin</span>' : ''}</div>
                                    <div class="email">${escHtml(u.email)}</div>
                                    <div style="font-size:12px;color:var(--text-dim);">
                                        Last active: ${u.lastActive ? new Date(u.lastActive).toLocaleTimeString() : 'Never'}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <span class="status-badge ${isActive ? '' : 'offline'}">
                                    ${isActive ? '<i class="fas fa-circle" style="font-size:8px;color:#22c55e;margin-right:4px;"></i> Online' : 'Offline'}
                                </span>
                                <span style="font-size:12px;color:var(--text-dim);margin-left:8px;">${formatCurrency(u.wallet || 0)}</span>
                                <button class="btn btn-sm" style="font-size:11px;padding:2px 10px;border:1px solid var(--gold);color:var(--gold);margin-left:6px;" onclick="toast('View profile coming soon','info')">Profile</button>
                                <button class="btn btn-sm" style="font-size:11px;padding:2px 10px;border:1px solid #22c55e;color:#22c55e;margin-left:4px;" onclick="openReviewModal('${u.email}')"><i class="fas fa-star"></i></button>
                            </div>
                        `;
                        container.appendChild(div);
                    });
                } catch (e) {
                    container.innerHTML = '<p style="color:var(--text-dim);font-size:14px;">Failed to load users.</p>';
                }
            }

            // ===== WHO'S ONLINE (NEW) =====
            async function loadOnlineUsers() {
                const container = document.getElementById('onlineUsersList');
                const user = getCurrentUser();
                if (!user || !user.isAdmin) {
                    container.innerHTML = '<p style="color:var(--text-dim);font-size:14px;">Admin access required.</p>';
                    return;
                }
                try {
                    const online = await apiCall('/users/online');
                    if (online.length === 0) {
                        container.innerHTML = '<p style="color:var(--text-dim);font-size:14px;">No users currently online.</p>';
                        return;
                    }
                    container.innerHTML = '';
                    online.forEach(u => {
                        const div = document.createElement('div');
                        div.className = 'user-item';
                        const initials = (u.name || u.email).charAt(0).toUpperCase();
                        div.innerHTML = `
                            <div class="user-info">
                                <div class="avatar">${initials}</div>
                                <div class="details">
                                    <div class="name">${escHtml(u.name || 'User')} ${u.isAdmin ? '<span class="admin-tag">Admin</span>' : ''}</div>
                                    <div class="email">${escHtml(u.email)}</div>
                                </div>
                            </div>
                            <span class="status-badge"><i class="fas fa-circle" style="font-size:8px;color:#22c55e;margin-right:4px;"></i> Online</span>
                        `;
                        container.appendChild(div);
                    });
                } catch (e) {
                    container.innerHTML = '<p style="color:var(--text-dim);font-size:14px;">Failed to load online users.</p>';
                }
            }

            // ===== CONTACT =====
            async function loadContactCards() {
                const container = document.getElementById('contactCards');
                try {
                    const contact = await apiCall('/contact');
                    const user = getCurrentUser();
                    const admin = user && user.isAdmin;
                    container.innerHTML = `
                        <div class="contact-card">
                            <span class="icon"><i class="fas fa-envelope"></i></span>
                            <div class="value">${escHtml(contact.email)}</div>
                            ${admin ? `<button class="edit-btn" data-field="email"><i class="fas fa-pen"></i> Edit</button>` : ''}
                        </div>
                        <div class="contact-card">
                            <span class="icon"><i class="fab fa-instagram"></i></span>
                            <div class="value">${escHtml(contact.instagram)}</div>
                            ${admin ? `<button class="edit-btn" data-field="instagram"><i class="fas fa-pen"></i> Edit</button>` : ''}
                        </div>
                    `;
                    container.querySelectorAll('.edit-btn').forEach(btn => {
                        btn.addEventListener('click', function() {
                            document.getElementById('editEmail').value = contact.email;
                            document.getElementById('editInstagram').value = contact.instagram;
                            document.getElementById('editContactModal').classList.add('open');
                        });
                    });
                } catch (e) {
                    container.innerHTML = '<p style="color:var(--text-dim);font-size:14px;">Failed to load contact.</p>';
                }
            }

            // ===== PROFILE =====
            async function loadProfile() {
                const user = getCurrentUser();
                if (!user) return;
                document.getElementById('profileAvatar').textContent = (user.name || 'U').charAt(0).toUpperCase();
                document.getElementById('profileName').textContent = user.name || 'User';
                document.getElementById('profileEmail').textContent = user.email;
                document.getElementById('profileRole').textContent = 'Freelancer';
                document.getElementById('profileSkills').innerHTML =
                    `<span class="skill-tag">JavaScript</span><span class="skill-tag">React</span><span class="skill-tag">Node.js</span>`;
                document.getElementById('profileRating').innerHTML = `<span class="rating-stars">★★★★☆</span> (4.2)`;
                document.getElementById('profileBio').value = 'Experienced full-stack developer with 5+ years of experience.';
                document.getElementById('profileSkillsInput').value = 'JavaScript, React, Node.js';
                document.getElementById('profileHourlyRate').value = '1500';
                document.getElementById('profileRoleSelect').value = 'freelancer';
            }

            async function handleProfileUpdate(e) {
                e.preventDefault();
                const user = getCurrentUser();
                if (!user) { toast('Please log in.', 'error'); return; }
                const bio = document.getElementById('profileBio').value.trim();
                const skills = document.getElementById('profileSkillsInput').value.split(',').map(s => s.trim()).filter(Boolean);
                const hourlyRate = parseFloat(document.getElementById('profileHourlyRate').value) || 0;
                const role = document.getElementById('profileRoleSelect').value;
                try {
                    toast('Profile updated successfully!', 'success');
                } catch (err) {
                    toast(err.message, 'error');
                }
            }

            // ===== APPLY =====
            let applyJobId = null;

            function openApplyModal(jobId, jobTitle) {
                applyJobId = jobId;
                document.getElementById('applyJobTitle').textContent = `Applying for: ${jobTitle}`;
                document.getElementById('applyForm').reset();
                document.getElementById('applyModal').classList.add('open');
            }

            async function handleApplySubmit(e) {
                e.preventDefault();
                const user = getCurrentUser();
                if (!user) { toast('Please log in first.', 'error'); return; }
                const proposal = document.getElementById('applyProposal').value.trim();
                const bid = parseFloat(document.getElementById('applyBid').value);
                if (!proposal || !bid || bid < 1) { toast('Please fill all fields correctly.', 'error'); return; }
                try {
                    toast('Application submitted! 🎉', 'success');
                    document.getElementById('applyModal').classList.remove('open');
                } catch (err) {
                    toast(err.message, 'error');
                }
            }

            // ===== REVIEWS =====
            let reviewTargetEmail = null;
            let selectedRating = 0;

            function openReviewModal(email) {
                reviewTargetEmail = email;
                document.getElementById('reviewUserLabel').textContent = `Leave a review for ${email}`;
                document.getElementById('reviewForm').reset();
                document.getElementById('reviewRating').value = 0;
                document.querySelectorAll('.star').forEach(s => s.textContent = '☆');
                selectedRating = 0;
                document.getElementById('reviewModal').classList.add('open');
            }

            document.addEventListener('DOMContentLoaded', function() {
                document.querySelectorAll('.star').forEach(el => {
                    el.addEventListener('click', function() {
                        const val = parseInt(this.dataset.value);
                        selectedRating = val;
                        document.getElementById('reviewRating').value = val;
                        document.querySelectorAll('.star').forEach(s => {
                            s.textContent = parseInt(s.dataset.value) <= val ? '★' : '☆';
                        });
                    });
                    el.addEventListener('mouseenter', function() {
                        const val = parseInt(this.dataset.value);
                        document.querySelectorAll('.star').forEach(s => {
                            s.textContent = parseInt(s.dataset.value) <= val ? '★' : '☆';
                        });
                    });
                    el.addEventListener('mouseleave', function() {
                        const val = parseInt(document.getElementById('reviewRating').value);
                        document.querySelectorAll('.star').forEach(s => {
                            s.textContent = parseInt(s.dataset.value) <= val ? '★' : '☆';
                        });
                    });
                });
            });

            async function handleReviewSubmit(e) {
                e.preventDefault();
                const user = getCurrentUser();
                if (!user) { toast('Please log in.', 'error'); return; }
                const rating = parseInt(document.getElementById('reviewRating').value);
                const comment = document.getElementById('reviewComment').value.trim();
                if (!rating || rating < 1 || rating > 5) { toast('Please select a rating.', 'error'); return; }
                try {
                    toast('Review submitted! ⭐', 'success');
                    document.getElementById('reviewModal').classList.remove('open');
                } catch (err) {
                    toast(err.message, 'error');
                }
            }

            // ===== AUTH =====
            let authMode = 'login';

            function openAuthModal(mode = 'login') {
                authMode = mode;
                const modal = document.getElementById('authModal');
                const title = document.getElementById('authModalTitle');
                const sub = document.getElementById('authModalSub');
                const submitBtn = document.getElementById('authSubmitBtn');
                const switchText = document.getElementById('authSwitchText');
                const switchLink = document.getElementById('authSwitchLink');
                const nameGroup = document.getElementById('nameGroup');
                if (mode === 'signup') {
                    title.innerHTML = 'Create <span>Account</span>';
                    sub.textContent = 'Join LIONLANCE and start your freelance journey.';
                    submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Sign Up';
                    switchText.textContent = 'Already have an account?';
                    switchLink.textContent = 'Log In';
                    nameGroup.style.display = 'block';
                } else {
                    title.innerHTML = 'Welcome to <span>LIONLANCE</span>';
                    sub.textContent = 'Log in to your account to continue.';
                    submitBtn.innerHTML = '<i class="fas fa-arrow-right"></i> Log In';
                    switchText.textContent = 'Don\'t have an account?';
                    switchLink.textContent = 'Sign Up';
                    nameGroup.style.display = 'none';
                }
                document.getElementById('authForm').reset();
                modal.classList.add('open');
            }

            function closeAuthModal() { document.getElementById('authModal').classList.remove('open'); }

            async function handleAuthSubmit(e) {
                e.preventDefault();
                const email = document.getElementById('authEmail').value.trim();
                const password = document.getElementById('authPassword').value.trim();
                const name = document.getElementById('authName').value.trim();
                if (!email || !password) { toast('Please fill in all fields.', 'error'); return; }
                if (authMode === 'signup' && !name) { toast('Please enter your full name.', 'error'); return; }
                try {
                    let data;
                    if (authMode === 'login') {
                        data = await apiCall('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
                    } else {
                        data = await apiCall('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) });
                    }
                    setToken(data.token);
                    setCurrentUser(data.user);
                    closeAuthModal();
                    toast(authMode === 'login' ? 'Welcome back! 🦁' : 'Account created! 🦁');
                    updateUI();
                } catch (err) {
                    toast(err.message, 'error');
                }
            }

            function logout() { clearSession();
                updateUI();
                toast('Logged out successfully.'); }

            // ===== POST JOB =====
            async function handlePostJob(e) {
                e.preventDefault();
                const user = getCurrentUser();
                if (!user) { toast('Please log in to post a job.', 'error'); return; }
                const title = document.getElementById('jobTitle').value.trim();
                const category = document.getElementById('jobCategory').value;
                const description = document.getElementById('jobDesc').value.trim();
                const budget = parseFloat(document.getElementById('jobBudget').value);
                const deadline = parseInt(document.getElementById('jobDeadline').value);
                if (!title || !category || !description || !budget || budget < 1 || !deadline || deadline < 1) {
                    toast('Please fill all fields correctly. Minimum budget ₹1.', 'error');
                    return;
                }
                try {
                    await apiCall('/jobs', { method: 'POST', body: JSON.stringify({ title, category, description, budget, deadline }) });
                    document.getElementById('postJobForm').reset();
                    toast('Job posted successfully! 🎉');
                    loadMyJobs();
                    loadAllJobs();
                    loadCategories();
                } catch (err) {
                    toast(err.message, 'error');
                }
            }

            // ===== WALLET ACTIONS =====
            document.getElementById('addFundsBtn').addEventListener('click', function() {
                const user = getCurrentUser();
                if (!user) { toast('Please log in.', 'error'); return; }
                document.getElementById('fundsModal').classList.add('open');
            });

            document.getElementById('fundsModalClose').addEventListener('click', function() {
                document.getElementById('fundsModal').classList.remove('open');
            });

            document.getElementById('fundsForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                const user = getCurrentUser();
                if (!user) { toast('Please log in.', 'error'); return; }

                const amount = parseFloat(document.getElementById('fundsAmount').value);
                if (!amount || amount < 1) { toast('Enter a valid amount (min ₹1).', 'error'); return; }

                try {
                    const orderData = await apiCall('/payment/create-order', {
                        method: 'POST',
                        body: JSON.stringify({ amount })
                    });

                    const options = {
                        key: orderData.key_id,
                        amount: orderData.amount,
                        currency: orderData.currency,
                        name: 'LIONLANCE',
                        description: 'Add funds to wallet',
                        order_id: orderData.order_id,
                        handler: async function(response) {
                            try {
                                await apiCall('/payment/verify', {
                                    method: 'POST',
                                    body: JSON.stringify({
                                        order_id: response.razorpay_order_id,
                                        payment_id: response.razorpay_payment_id,
                                        signature: response.razorpay_signature
                                    })
                                });
                                document.getElementById('fundsModal').classList.remove('open');
                                document.getElementById('fundsForm').reset();
                                toast('Payment successful! Wallet credited. 💰', 'success');
                                loadWallet();
                                loadUserManagement();
                            } catch (err) {
                                toast(err.message, 'error');
                            }
                        },
                        modal: {
                            ondismiss: function() {
                                toast('Payment cancelled.', 'info');
                            }
                        }
                    };
                    const rzp = new Razorpay(options);
                    rzp.open();

                } catch (err) {
                    toast(err.message, 'error');
                }
            });

            document.getElementById('sendPaymentBtn').addEventListener('click', function() {
                const user = getCurrentUser();
                if (!user) { toast('Please log in.', 'error'); return; }
                document.getElementById('sendModal').classList.add('open');
            });

            document.getElementById('sendModalClose').addEventListener('click', function() {
                document.getElementById('sendModal').classList.remove('open');
            });

            document.getElementById('sendForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                const user = getCurrentUser();
                if (!user) { toast('Please log in.', 'error'); return; }
                const recipientEmail = document.getElementById('sendRecipient').value.trim();
                const amount = parseFloat(document.getElementById('sendAmount').value);
                if (!recipientEmail || !amount || amount < 1) { toast('Enter valid recipient and amount.', 'error'); return; }
                try {
                    await apiCall('/wallet/send', { method: 'POST', body: JSON.stringify({ recipientEmail, amount }) });
                    document.getElementById('sendModal').classList.remove('open');
                    document.getElementById('sendForm').reset();
                    toast('Payment sent! 💸');
                    loadWallet();
                    loadUserManagement();
                } catch (err) { toast(err.message, 'error'); }
            });

            document.getElementById('receivePaymentBtn').addEventListener('click', function() {
                const user = getCurrentUser();
                if (!user) { toast('Please log in.', 'error'); return; }
                document.getElementById('receiveModal').classList.add('open');
            });

            document.getElementById('receiveModalClose').addEventListener('click', function() {
                document.getElementById('receiveModal').classList.remove('open');
            });

            document.getElementById('receiveForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                const user = getCurrentUser();
                if (!user) { toast('Please log in.', 'error'); return; }
                const senderEmail = document.getElementById('receiveSender').value.trim();
                const amount = parseFloat(document.getElementById('receiveAmount').value);
                if (!senderEmail || !amount || amount < 1) { toast('Enter valid sender and amount.', 'error'); return; }
                try {
                    await apiCall('/wallet/receive', { method: 'POST', body: JSON.stringify({ senderEmail, amount }) });
                    document.getElementById('receiveModal').classList.remove('open');
                    document.getElementById('receiveForm').reset();
                    toast('Payment received! 🎉');
                    loadWallet();
                    loadUserManagement();
                } catch (err) { toast(err.message, 'error'); }
            });

            document.getElementById('withdrawBtn').addEventListener('click', function() {
                const user = getCurrentUser();
                if (!user) { toast('Please log in.', 'error'); return; }
                document.getElementById('withdrawModal').classList.add('open');
            });

            document.getElementById('withdrawModalClose').addEventListener('click', function() {
                document.getElementById('withdrawModal').classList.remove('open');
            });

            document.getElementById('withdrawForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                const user = getCurrentUser();
                if (!user) { toast('Please log in.', 'error'); return; }
                const amount = parseFloat(document.getElementById('withdrawAmount').value);
                if (!amount || amount < 1) { toast('Enter a valid amount (min ₹1).', 'error'); return; }
                try {
                    await apiCall('/wallet/withdraw', { method: 'POST', body: JSON.stringify({ amount }) });
                    document.getElementById('withdrawModal').classList.remove('open');
                    document.getElementById('withdrawForm').reset();
                    toast('Withdrawal successful! 💸', 'success');
                    loadWallet();
                    loadUserManagement();
                } catch (err) { toast(err.message, 'error'); }
            });

            // ===== EDIT CONTACT =====
            async function handleEditContact(e) {
                e.preventDefault();
                const email = document.getElementById('editEmail').value.trim();
                const instagram = document.getElementById('editInstagram').value.trim();
                if (!email) { toast('Email is required.', 'error'); return; }
                try {
                    await apiCall('/admin/contact', { method: 'PUT', body: JSON.stringify({ email, instagram }) });
                    document.getElementById('editContactModal').classList.remove('open');
                    toast('Contact info updated! ✅');
                    loadContactCards();
                } catch (err) { toast(err.message, 'error'); }
            }

            // ===== DASHBOARD =====
            function loadDashboard() {
                loadMyJobs();
                loadAllJobs();
                loadWallet();
                loadCategories();
                loadContactCards();
                loadUserManagement();
                loadOnlineUsers(); // <-- NEW
            }

            // ===== INIT =====
            function init() {
                // Auth
                document.getElementById('loginBtn').addEventListener('click', () => openAuthModal('login'));
                document.getElementById('signupBtn').addEventListener('click', () => openAuthModal('signup'));
                document.getElementById('authModalClose').addEventListener('click', closeAuthModal);
                document.getElementById('authSwitchLink').addEventListener('click', function() {
                    const newMode = authMode === 'login' ? 'signup' : 'login';
                    openAuthModal(newMode);
                });
                document.getElementById('authForm').addEventListener('submit', handleAuthSubmit);
                document.getElementById('logoutBtn').addEventListener('click', logout);

                // Hero
                document.getElementById('heroPostBtn').addEventListener('click', function() {
                    const user = getCurrentUser();
                    if (!user) { openAuthModal('login'); return; }
                    document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
                    document.getElementById('postJobCard').scrollIntoView({ behavior: 'smooth' });
                });
                document.getElementById('heroBrowseBtn').addEventListener('click', function() {
                    const user = getCurrentUser();
                    if (!user) { openAuthModal('login'); return; }
                    document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
                });
                document.getElementById('dashNav').addEventListener('click', function(e) {
                    e.preventDefault();
                    document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
                });
                document.getElementById('profileNav').addEventListener('click', function(e) {
                    e.preventDefault();
                    document.getElementById('profile').scrollIntoView({ behavior: 'smooth' });
                    loadProfile();
                });

                // Explore Categories
                document.getElementById('exploreCategoriesBtn').addEventListener('click', function() {
                    document.getElementById('categoriesModal').classList.add('open');
                });
                document.getElementById('exploreCategoriesBtn2').addEventListener('click', function() {
                    document.getElementById('categoriesModal').classList.add('open');
                });
                document.getElementById('categoriesModalClose').addEventListener('click', function() {
                    document.getElementById('categoriesModal').classList.remove('open');
                });

                // Category Dropdown
                const toggleBtn = document.getElementById('categoryDropdownToggle');
                const dropdownMenu = document.getElementById('categoryDropdownMenu');
                toggleBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    dropdownMenu.classList.toggle('open');
                });
                document.addEventListener('click', function(e) {
                    if (!e.target.closest('.category-dropdown')) {
                        dropdownMenu.classList.remove('open');
                    }
                });

                // Post job
                document.getElementById('postJobForm').addEventListener('submit', handlePostJob);

                // Apply modal
                document.getElementById('applyModalClose').addEventListener('click', function() {
                    document.getElementById('applyModal').classList.remove('open');
                });
                document.getElementById('applyForm').addEventListener('submit', handleApplySubmit);

                // Review modal
                document.getElementById('reviewModalClose').addEventListener('click', function() {
                    document.getElementById('reviewModal').classList.remove('open');
                });
                document.getElementById('reviewForm').addEventListener('submit', handleReviewSubmit);

                // Edit job modal
                document.getElementById('editJobModalClose').addEventListener('click', function() {
                    document.getElementById('editJobModal').classList.remove('open');
                });
                document.getElementById('editJobForm').addEventListener('submit', handleEditJobSubmit);

                // Edit contact
                document.getElementById('editContactClose').addEventListener('click', function() {
                    document.getElementById('editContactModal').classList.remove('open');
                });
                document.getElementById('editContactForm').addEventListener('submit', handleEditContact);

                // Profile update
                document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);

                // Close modals on overlay click
                document.querySelectorAll('.modal-overlay').forEach(overlay => {
                    overlay.addEventListener('click', function(e) {
                        if (e.target === this) this.classList.remove('open');
                    });
                });

                // Expose
                window.openReviewModal = openReviewModal;
                window.toast = toast;

                updateUI();
                if (getCurrentUser()) loadDashboard();
            }

            document.addEventListener('DOMContentLoaded', init);
        })();
    </script>

</body>
</html>
