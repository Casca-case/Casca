# Casca - Custom Smartphone Case E-commerce Platform

Casca is an innovative e-commerce website where users can create customized smartphone cases. With Casca, users have the option to upload their own images or generate images using AI, as well as customize colors, resize images, choose different models, and select quality levels.

[Visit Casca Website](https://casca-ten.vercel.app)

# Showcase

![Custom Cases Slideshow](./assets/slideshow.gif)



## Features

- **Upload Custom Images**: Personalize your phone case by uploading your own photos.
- **AI Image Generator**: Create unique images with the built-in AI tool.
- **Customization Options**:
  - Color adjustments
  - Image resizing
  - Model selection
  - Quality variations
- **Secure Payments**: Integrated with Stripe for seamless payment processing.
- **User Authentication**: Supports OAuth for secure login/signup.
- **Responsive Design**: Built with Tailwind CSS for an optimal experience across devices.

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Neon Prisma DB with PostgreSQL
- **File Upload**: Uploadthing
- **Authentication**: OAuth
- **Payments**: Stripe
- **Deployment**: Vercel

## Getting Started

To get a local copy of Casca up and running, follow these steps:

### Prerequisites

Ensure that you have Node.js installed on your system.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/casca-case/casca.git
   cd casca
2. **Install the required packages**:
   ```bash
   npm install
3. **Set up environment variables**:
   Create a .env file in the root directory.
   Copy the content from env_example and update the values as needed.
4. **Run the development server**:
   ```bash
   npm run dev
  The application will be available at http://localhost:3000

## Usage
1. Navigate to http://localhost:3000.
2. Sign up or log in using OAuth.
3. Start customizing your smartphone case with various options.
4. Proceed to checkout and pay using the secure Stripe payment gateway.

## Deployment
**Casca is deployed on Vercel. To deploy your own version**:
1. Push your repository to GitHub.
2. Connect your GitHub repo to Vercel and deploy with a single click.

## Contributing
**We welcome contributions! Please follow these steps**:
1. Fork the repository.
2. Create a new branch (git checkout -b feature/YourFeature).
3. Commit your changes (git commit -m 'Add some feature').
4. Push to the branch (git push origin feature/YourFeature).
5. Open a pull request.
   
   
