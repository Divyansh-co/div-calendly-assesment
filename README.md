# Divyansh Mishra – Wealth Multiplication via Agri Land Investments

A fully functional, self-hosted meeting booking application that is a near-exact visual and functional replica of the original Calendly page for **“Divyansh Mishra – wealth multiplication via agri land investments”**.

Built with React + TypeScript + Vite + Tailwind CSS.

## Design & Color Palette
- **Primary / Accent**: Royal Iris (`#5B4B8A`)
- **Background / Secondary**: Butter Yellow (`#F5E6C8`)
- **Cards & Panels**: Pure White (`#FFFFFF`) with light butter-yellow borders (`#EDE0C4`)
- **Text**: Near-black (`#1A1A1A`)
- **Available / Selected Dates & Buttons**: Royal Iris (`#5B4B8A`)
- **Disabled / Past Dates**: Muted gray (`#9CA3AF`)
- **Layout**: Classic two-column Calendly layout with host details on the left, calendar & booking on the right, and the "POWERED BY" corner ribbon in the top-right.

## Availability Rules
- **Meeting Duration**: 60 minutes
- **Recurring Windows (IST)**:
  - Thursdays → 14:00 – 16:00 (`2:00 PM` and `3:00 PM`)
  - Saturdays → 11:00 – 13:00 (`11:00 AM` and `12:00 PM`)
- **Blocked Dates**: September 24 of any year is completely blocked (never selectable)
- **Dynamic Slots**: Calendar highlights only days with open slots; selecting a date shows only valid 1-hour slots.

## Booking Form Fields
After choosing a time slot, the form captures:
1. **First name \*** (Text)
2. **Last name \*** (Text)
3. **Email \*** (Email)
4. **Add guests** (Optional multi-email tag field)
5. **Which city are you based in? \*** (Text)
6. **Where is your hometown? \*** (Radio buttons: Delhi/NCR, Uttar Pradesh/Haryana, Punjab)
7. **How much income do you make? \*** (Dropdown with "Select…" placeholder + realistic income ranges)
8. **How much land you want to buy?** (Checkboxes: 1000 sqm, 1000-2000 sqm, 2000 sqm+)
9. **What is your whatsapp number? \*** (Phone with +91 prefix)

Bookings are persisted locally in `localStorage` and a confirmation screen is displayed with an `.ics` calendar invite download.

## Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev
```

Open `http://localhost:5173` to view the booking application.

## Production Build

```bash
npm run build
npm run preview
```
