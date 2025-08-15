# 🌈 J-gz-bot 🌈

A stylish, feature-rich WhatsApp bot powered by [Baileys](https://github.com/WhiskeySockets/Baileys), designed by Jagwax.  
Supports owner pairing, secure code-based access, powerful  commands, media utilities, message tracking, and multi-platform deployment (Heroku, Katabump, Replit, AWS, DigitalOcean, Azure, Vultr, Google Cloud, and more!).

![Bot Profile](assets/jgzbot-profile.png)

---

## 🚀 Features

- **Owner Pairing System:**  
  Owners can pair users securely using codes (e.g., `JagX1234`). Non-owners must request pairing.

- **Commands Menu:**  
  `.menu` / `.help` — Shows all main commands and features.

- **Message Utilities:**
  - `.ping` — Bot speed test.
  - `.quote` — Get a random coding quote.
  - `.sticker` — Convert sent image to WhatsApp sticker.
  - `.groupinfo` — Show group name & member count.
  - **Save View Once:**  
    Save "view once" media before it disappears.
  - **Retrieve Deleted Messages:**  
    Notify and recover deleted messages in chat.

- **Reactions & Status:**
  - `.react <emoji>` — React to messages with emojis.
  - `.viewstatus` — View message delivery/read status.
  - `.reactstatus <emoji>` — React to WhatsApp statuses.

- **More Utilities:**
  - Owner-only commands for admin tasks.
  - User request system for pairing.
  - Customizable bot profile image (with stylish gradients/shadow).

---

## 💻 Deployment Options

Deploy J-gz-bot on dozens of panels & cloud providers:
- **Katabump** (`katabump.config.js` included for instant panel deployment)
- **Heroku**
- **Replit**
- **AWS**
- **DigitalOcean**
- **Azure**
- **Google Cloud**
- **Vultr**
- **Any Node.js hosting**

Simply clone the repo, set your `.env`, upload your profile image, and run `npm install`!

---

## 🔧 Quick Start

1. Clone this repo.
2. Place your stylish profile image at `assets/jgzbot-profile.png`.
3. Set owner numbers in `.env`:
    ```
    OWNERS=2349160654415,2347050512232
    ```
4. Install dependencies:
    ```bash
    npm install
    ```
5. Start your bot:
    ```bash
    npm start
    ```
6. For Katabump, Heroku, or other panels, follow platform-specific instructions.

---

## 📋 Main Commands

| Command                  | Description                                   |
|--------------------------|-----------------------------------------------|
| `.menu` / `.help`        | Show all commands and features                |
| `.pair JagX <number>`    | Owner: Generate pairing code                  |
| `.requestpair`           | User: Request pairing from owner              |
| `.ping`                  | Bot speed test                                |
| `.quote`                 | Random coding quote                           |
| `.sticker`               | Convert image to sticker                      |
| `.groupinfo`             | Group name & member count                     |
| `.saveviewonce`          | Save "view once" media                        |
| `.retrieve`              | Retrieve deleted messages                     |
| `.react <emoji>`         | React to a message                            |
| `.viewstatus`            | View message delivery/read status             |
| `.reactstatus <emoji>`   | React to a WhatsApp status                    |

---

## 🛡️ Secure Pairing

- Only owners can pair users using `.pair JagX <number>`.
- Non-owners must send `.requestpair` to get pairing help.

---

## 🖼️ Custom Branding

- Use a colorful, modern font with gradient/shadow for your bot profile image.
- Image shown in menus and bot profile.

---

## 🤝 Contributing

Pull requests, issues, and suggestions are welcome!
See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📄 License

MIT
