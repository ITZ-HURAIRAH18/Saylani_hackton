import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail } from "../middleware/nodemail.js";

// console.log("JET TOken generated",process.env.JWT_SECRET);
// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "5m" });
};

// @desc Signup
// @desc Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Welcome email (user)
   const userWelcomeTemplate = (user) => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to FundHub</title>
  </head>
  <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px 20px;">
    
    <!-- Main Container -->
    <table role="presentation" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04);">
      <tr>
        <td>
          
          <!-- Header with Logo & Illustration -->
          <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:50px 30px;text-align:center;position:relative;">
            <div style="background:#ffffff;width:80px;height:80px;margin:0 auto 24px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 20px rgba(0,0,0,0.15);">
              <span style="font-size:42px;line-height:1;">🎯</span>
            </div>
            <h1 style="margin:0;color:#ffffff;font-size:32px;font-weight:700;letter-spacing:-0.5px;">Welcome to FundHub!</h1>
            <p style="margin:12px 0 0;color:rgba(255,255,255,0.95);font-size:18px;font-weight:500;">We're thrilled to have you here</p>
          </div>

          <!-- Main Content -->
          <div style="padding:45px 35px;">
            
            <!-- Personalized Greeting -->
            <div style="margin-bottom:30px;">
              <h2 style="margin:0 0 16px;color:#111827;font-size:24px;font-weight:700;">
                Hi ${user.name} 👋
              </h2>
              <p style="margin:0;color:#4b5563;font-size:16px;line-height:1.7;">
                You've just joined <strong style="color:#667eea;">FundHub</strong> — your ultimate platform to create, support, and track meaningful campaigns that make a real difference. Let's get you started on this exciting journey!
              </p>
            </div>

            <!-- Account Details Card -->
            <div style="background:linear-gradient(135deg,#f8f9ff 0%,#f3f4ff 100%);border-radius:12px;padding:28px;margin:30px 0;border:1px solid #e0e7ff;">
              <h3 style="margin:0 0 20px;color:#374151;font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">
                📋 Your Account Details
              </h3>
              
              <table role="presentation" style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e0e7ff;">
                    <span style="color:#6b7280;font-size:14px;font-weight:600;">Email Address</span>
                  </td>
                  <td style="padding:10px 0;border-bottom:1px solid #e0e7ff;text-align:right;">
                    <span style="color:#111827;font-size:15px;font-weight:600;">${user.email}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">
                    <span style="color:#6b7280;font-size:14px;font-weight:600;">Member Since</span>
                  </td>
                  <td style="padding:10px 0;text-align:right;">
                    <span style="color:#111827;font-size:15px;font-weight:600;">${new Date(user.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric'
                    })}</span>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Quick Start Guide -->
            <div style="margin:35px 0;">
              <h3 style="margin:0 0 20px;color:#374151;font-size:18px;font-weight:700;">
                🚀 Quick Start Guide
              </h3>
              
              <div style="margin-bottom:16px;padding-left:28px;position:relative;">
                <div style="position:absolute;left:0;top:4px;width:20px;height:20px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;color:#fff;text-align:center;line-height:20px;font-size:11px;font-weight:700;">1</div>
                <div style="color:#374151;font-size:15px;font-weight:600;margin-bottom:4px;">Explore Your Dashboard</div>
                <div style="color:#6b7280;font-size:14px;line-height:1.5;">Get familiar with all the tools and features available to you</div>
              </div>

              <div style="margin-bottom:16px;padding-left:28px;position:relative;">
                <div style="position:absolute;left:0;top:4px;width:20px;height:20px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;color:#fff;text-align:center;line-height:20px;font-size:11px;font-weight:700;">2</div>
                <div style="color:#374151;font-size:15px;font-weight:600;margin-bottom:4px;">Create Your First Campaign</div>
                <div style="color:#6b7280;font-size:14px;line-height:1.5;">Share your story and start making an impact today</div>
              </div>

              <div style="padding-left:28px;position:relative;">
                <div style="position:absolute;left:0;top:4px;width:20px;height:20px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;color:#fff;text-align:center;line-height:20px;font-size:11px;font-weight:700;">3</div>
                <div style="color:#374151;font-size:15px;font-weight:600;margin-bottom:4px;">Connect & Support</div>
                <div style="color:#6b7280;font-size:14px;line-height:1.5;">Browse and support campaigns that resonate with you</div>
              </div>
            </div>

            <!-- CTA Button -->
            <div style="margin:40px 0 30px;text-align:center;">
              <a href="https://itz-hurairah.vercel.app" 
                 style="display:inline-block;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:10px;font-weight:700;font-size:16px;box-shadow:0 10px 15px -3px rgba(102,126,234,0.4);letter-spacing:0.3px;">
                Go to Dashboard →
              </a>
            </div>

            <!-- Help Section -->
            <div style="background:#f9fafb;border-radius:10px;padding:24px;text-align:center;border:1px solid #e5e7eb;">
              <p style="margin:0 0 12px;color:#6b7280;font-size:15px;line-height:1.6;">
                Need help getting started? We're here for you!
              </p>
              <a href="#" style="color:#667eea;text-decoration:none;font-weight:600;font-size:15px;margin:0 12px;">Visit Help Center</a>
              <span style="color:#d1d5db;">•</span>
              <a href="#" style="color:#667eea;text-decoration:none;font-weight:600;font-size:15px;margin:0 12px;">Contact Support</a>
            </div>

          </div>

          <!-- Footer -->
          <div style="background:#f9fafb;padding:30px 35px;border-top:1px solid #e5e7eb;">
            <table role="presentation" style="width:100%;">
              <tr>
                <td style="text-align:center;">
                  <p style="margin:0 0 12px;color:#6b7280;font-size:14px;line-height:1.6;">
                    You're receiving this email because you created an account on <strong style="color:#667eea;">FundHub</strong>
                  </p>
                  <div style="margin:16px 0;">
                    <a href="#" style="display:inline-block;margin:0 8px;color:#9ca3af;text-decoration:none;font-size:13px;">Privacy Policy</a>
                    <span style="color:#d1d5db;">•</span>
                    <a href="#" style="display:inline-block;margin:0 8px;color:#9ca3af;text-decoration:none;font-size:13px;">Terms of Service</a>
                    <span style="color:#d1d5db;">•</span>
                    <a href="#" style="display:inline-block;margin:0 8px;color:#9ca3af;text-decoration:none;font-size:13px;">Unsubscribe</a>
                  </div>
                  <p style="margin:16px 0 0;color:#d1d5db;font-size:13px;">
                    © ${new Date().getFullYear()} FundHub. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </div>

        </td>
      </tr>
    </table>

    <!-- Spacer -->
    <div style="height:20px;"></div>

  </body>
</html>
`;
const adminNewUserTemplate = (user) => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New User Registered - FundHub</title>
  </head>
  <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px 20px;">
    
    <!-- Main Container -->
    <table role="presentation" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04);">
      <tr>
        <td>
          
          <!-- Header with Gradient -->
          <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px 30px;text-align:center;">
            <div style="background:#ffffff;width:60px;height:60px;margin:0 auto 20px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);">
              <span style="font-size:32px;line-height:1;">🎉</span>
            </div>
            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">New User Registered!</h1>
            <p style="margin:10px 0 0;color:rgba(255,255,255,0.9);font-size:16px;">Someone just joined FundHub</p>
          </div>

          <!-- Content -->
          <div style="padding:40px 30px;">
            <p style="margin:0 0 30px;color:#374151;font-size:16px;line-height:1.6;">
              Great news! A new user has successfully signed up on <strong style="color:#667eea;">FundHub</strong>. Here are their details:
            </p>

            <!-- User Details Card -->
            <table role="presentation" style="width:100%;border-collapse:separate;border-spacing:0;background:linear-gradient(135deg,#f8f9ff 0%,#f3f4ff 100%);border-radius:12px;overflow:hidden;border:1px solid #e0e7ff;">
              <tr>
                <td style="padding:24px;">
                  
                  <!-- Name -->
                  <div style="margin-bottom:20px;">
                    <div style="display:flex;align-items:center;margin-bottom:6px;">
                      <span style="font-size:18px;margin-right:8px;">👤</span>
                      <span style="color:#6b7280;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Full Name</span>
                    </div>
                    <div style="color:#111827;font-size:18px;font-weight:600;padding-left:26px;">${user.name}</div>
                  </div>

                  <!-- Email -->
                  <div style="margin-bottom:20px;">
                    <div style="display:flex;align-items:center;margin-bottom:6px;">
                      <span style="font-size:18px;margin-right:8px;">📧</span>
                      <span style="color:#6b7280;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Email Address</span>
                    </div>
                    <div style="color:#111827;font-size:16px;font-weight:500;padding-left:26px;word-break:break-all;">${user.email}</div>
                  </div>

                  <!-- Role -->
                  <div style="margin-bottom:20px;">
                    <div style="display:flex;align-items:center;margin-bottom:6px;">
                      <span style="font-size:18px;margin-right:8px;">🏷️</span>
                      <span style="color:#6b7280;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">User Role</span>
                    </div>
                    <div style="padding-left:26px;">
                      <span style="display:inline-block;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#ffffff;padding:6px 14px;border-radius:20px;font-size:14px;font-weight:600;text-transform:capitalize;">${user.role}</span>
                    </div>
                  </div>

                  <!-- Date -->
                  <div>
                    <div style="display:flex;align-items:center;margin-bottom:6px;">
                      <span style="font-size:18px;margin-right:8px;">📅</span>
                      <span style="color:#6b7280;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Registration Date</span>
                    </div>
                    <div style="color:#111827;font-size:16px;font-weight:500;padding-left:26px;">${new Date(user.createdAt).toLocaleString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</div>
                  </div>

                </td>
              </tr>
            </table>

           

          </div>

          <!-- Footer -->
          <div style="background:#f9fafb;padding:30px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="margin:0 0 10px;color:#9ca3af;font-size:14px;line-height:1.6;">
              This is an automatic notification from <strong style="color:#667eea;">FundHub</strong>
            </p>
            <p style="margin:0;color:#d1d5db;font-size:13px;">
              © ${new Date().getFullYear()} FundHub. All rights reserved.
            </p>
          </div>

        </td>
      </tr>
    </table>

    <!-- Spacer for email clients -->
    <div style="height:20px;"></div>

  </body>
</html>
`;


    // ✅ Send welcome email to user
    await sendEmail(user._id, "Welcome to FundHub 🎉", userWelcomeTemplate(user));

    // ✅ Send new user alert to admin
    await sendEmail(user._id, "🚨 New User Registered", adminNewUserTemplate(user), true);

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// @desc Login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
