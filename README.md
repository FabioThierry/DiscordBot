# DiscordBot

Welcome to DiscordBot – a NodeJS-powered Discord bot built with the [Discord.JS](https://discord.js.org/) library. This project is designed as a tutorial series for beginners who want to build their own Discord bot while learning best practices and modern JavaScript.

## 🚀 Features

-   **Responsive Commands**: Easily reply to chat commands using a modular command system.
-   **Event Handling**: Seamlessly handle Discord events such as interactions.
-   **Command Cooldowns**: Prevent command spam using per-user cooldowns.
-   **Dynamic Loading**: Automatically load commands from a specified directory.
-   **Error Handling**: Robust error reporting with logging via consola.

---

## 📋 Prerequisites

Before you begin, ensure you have:

-   A basic understanding of JavaScript and NodeJS.
-   A Discord account with permissions to create and manage a bot.
-   [NodeJS](https://nodejs.org/) (v14 or later) installed on your machine.
-   [npm](https://www.npmjs.com/) for package management.

---

## 🛠️ Installation

Follow these steps to set up the project locally:

1. **Clone the Repository**
    ```bash
    git clone https://github.com/FabioThierry/DiscordBot.git
    ```
2. **Navigate to the Project Directory**
    ```bash
    cd DiscordBot
    ```
3. **Install Dependencies**
    ```bash
    npm install
    ```
4. **Configure Your Bot**
    - Create a `.env` file in the root directory.
    - Add your Discord bot token and any necessary configuration:
        ```
        DISCORD_BOT_TOKEN=your_discord_bot_token_here
        ```
    - Alternatively, update the configuration in `src/config.js` as needed.
5. **Run the Bot**
    ```bash
    node src/index.js
    ```
    Or for development with auto-reload:
    ```bash
    npm run dev
    ```

---

## 🔧 Configuration

The main configuration file is [src/config.js](src/config.js). You can tweak various settings such as:

-   Command prefix
-   Bot status
-   Cooldown settings (default and custom for each command)
-   Autoload options for commands

Commands are auto-loaded from the directory specified in the `CommandHandler` (default is `./src/commands`).

---

## 📖 Tutorial

This tutorial series walks you through:

-   Setting up the development environment
-   Creating and managing Discord bot commands
-   Handling interactions and events with Discord.JS
-   Implementing cooldown features to prevent abuse

Watch the tutorial series on the M7rlin YouTube channel to follow along step-by-step.

---

## 👨‍💻 Project Structure

-   **src/**: Contains the source code.
    -   **events/**: Event handlers (e.g., [interaction-create.event.js](src/events/interaction-create.event.js)).
    -   **commands/**: Individual command modules.
    -   **config.js**: Core configuration for your bot.
    -   **CommandHandler.js**: Handles command loading and execution.
-   **README.md**: This file.
-   **changelog-release.md**: Contains release notes and changelog information.

---

## 📄 License

&copy; 2023-PRESENT Marcin Stawowczyk

This project is licensed under the GNU General Public License v3.0 – see the [LICENSE](LICENSE) file for details.
