# HG Gongs Consulting Engineers — Website

Client website for **HG Gongs Consulting Engineers**, a South African multidisciplinary engineering and construction management firm.

**Live site:** [https://hggongsconsulting.co.za/](https://hggongsconsulting.co.za/)

---

## About this project

This was a **client website build** for HG Gongs Consulting Engineers. The brief was to deliver a professional, mobile-friendly company site that presents their engineering services, leadership, and especially their **SACPCMP mentorship / Road to Registration** offering.

### What was needed

- Clear brand presence for HG Gongs Consulting Engineers
- Homepage hero with strong messaging and calls to action
- Company profile (“Who we are”) with vision, mission, and core business areas
- Leadership / team section with real staff profiles
- Services grid across civil, construction management, infrastructure, and mentorship
- SACPCMP mentorship programme details, registration routes, fees, FAQs, and downloadable resources
- Projects, social responsibility, careers, and contact sections
- Working contact form (submissions to the company info email)
- Responsive layout for phone, tablet, and desktop
- Mentorship welcome popup and scroll / interaction polish
- Developer credit for [Chabala DevLab](https://chabalaladevlab.co.za)

---

## Links

| | URL |
|---|---|
| **Live website** | [https://hggongsconsulting.co.za/](https://hggongsconsulting.co.za/) |
| **Developer** | [https://chabalaladevlab.co.za](https://chabalaladevlab.co.za) |
| **SACPCMP** | [https://sacpcmp.org.za/](https://sacpcmp.org.za/) |

**Contact (client)**  
- Mobile: [076 7911 676](tel:0767911676)  
- Email: [info@hggongsconsulting.co.za](mailto:info@hggongsconsulting.co.za)  
- Mentorship: [mentorship@hggongsconsulting.co.za](mailto:mentorship@hggongsconsulting.co.za)

---

## Tech stack

- Static HTML / CSS / JavaScript (no framework)
- Google Fonts (Syne + DM Sans)
- [FormSubmit](https://formsubmit.co/) for the contact form endpoint

---

## Project structure

```
├── index.html          # Main site page
├── css/
│   ├── variables.css   # Design tokens
│   └── styles.css      # Layout and components
├── js/
│   └── main.js         # Nav, animations, form, tabs, popup
├── images/             # Logos, team photos, assets
├── documents/          # SACPCMP downloadable resources
└── README.md
```

---

## Local preview

Open `index.html` in a browser, or serve the folder locally:

```bash
# Example with Python
python -m http.server 8080
```

Then visit `http://localhost:8080`.

> Note: the contact form uses FormSubmit and works best when tested on a live/public URL (not always from `file://`).

---

## Client

Built for **HG Gongs Consulting Engineers** as a production company website.

Developed by [Chabala DevLab](https://chabalaladevlab.co.za).
