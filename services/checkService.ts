// services/checkService.ts
import { Alert } from "react-native";

// ==========================================
// TYPE DEFINITIONS
// ==========================================
export interface CheckSubmissionData {
  user_id: string;
  username: string;
  project_id: string;
  breadcrumb: string;
  check_name: string;
  status: "pass" | "fail";
  image_url?: string;
  reason_for_failure?: string;
  process_miss?: boolean;
  technical_miss?: boolean;
  corrective_measure?: string;
}

export interface PhotoReview {
  status: "pass" | "fail" | null;
  image_url?: string;
  timestamp?: string;
}

export interface Check {
  id: string;
  label: string;
  photos?: PhotoReview[];
  subChecks?: Check[];
}

export interface Project {
  id: string;
  title: string;
  checks: Check[];
}

// ==========================================
// API CONFIGURATION
// ==========================================
const API_ENDPOINTS = {
  DB_SAVE: "https://elementortemplates.in/wp-json/myapp/v1/check-result",
  EMAIL_SERVICE: "https://sendemailapi-seven.vercel.app/api/send-completion-email",
  WP_UPLOAD: "https://elementortemplates.in/wp-json/myapp/v1/upload-image",
};

// ==========================================
// CHECK SERVICE
// ==========================================
export class CheckService {
  /**
   * Save check result to database
   */
  static async saveCheckToDatabase(data: CheckSubmissionData): Promise<boolean> {
    try {
      const response = await fetch(API_ENDPOINTS.DB_SAVE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`DB save failed: ${response.statusText}`);
      }

      console.log("✅ Check saved to database");
      return true;
    } catch (error) {
      console.error("❌ DB save error:", error);
      throw error;
    }
  }

  /**
   * Update local check state with photo review
   */
  static updateLocalCheckState(
    check: Check,
    status: "pass" | "fail",
    imageUrl?: string
  ): void {
    if (!check.photos) {
      check.photos = [];
    }

    check.photos.push({
      status,
      image_url: imageUrl,
      timestamp: new Date().toISOString(),
    });

    console.log("📸 Local check state updated:", check.label, status);
  }

  /**
   * Check if all subchecks are completed (have status)
   */
  static areAllSubchecksCompleted(check: Check): boolean {
    if (!check.subChecks || check.subChecks.length === 0) {
      // Leaf check - completed if has any photo review
      return check.photos && check.photos.length > 0
        ? check.photos.some((p) => p.status === "pass" || p.status === "fail")
        : false;
    }

    // Parent check - all children must be completed
    return check.subChecks.every((subCheck) =>
      CheckService.areAllSubchecksCompleted(subCheck)
    );
  }

  /**
   * Get overall status of a check (pass if all pass, fail if any fail)
   */
  static getCheckOverallStatus(check: Check): "pass" | "fail" | "incomplete" {
    if (!check.subChecks || check.subChecks.length === 0) {
      // Leaf check
      if (!check.photos || check.photos.length === 0) return "incomplete";
      const hasPass = check.photos.some((p) => p.status === "pass");
      const hasFail = check.photos.some((p) => p.status === "fail");
      
      if (hasFail) return "fail";
      if (hasPass) return "pass";
      return "incomplete";
    }

    // Parent check - recursive check
    const statuses = check.subChecks.map((sub) =>
      CheckService.getCheckOverallStatus(sub)
    );

    if (statuses.includes("incomplete")) return "incomplete";
    if (statuses.includes("fail")) return "fail";
    return "pass";
  }

  /**
   * Gather statistics for a check and its subchecks
   */
  static gatherCheckStats(check: Check): {
    total: number;
    completed: number;
    passed: number;
    failed: number;
  } {
    let total = 0;
    let completed = 0;
    let passed = 0;
    let failed = 0;

    const traverse = (c: Check) => {
      if (!c.subChecks || c.subChecks.length === 0) {
        // Leaf check
        total++;
        if (c.photos && c.photos.length > 0) {
          const hasFail = c.photos.some((p) => p.status === "fail");
          const hasPass = c.photos.some((p) => p.status === "pass");
          
          if (hasFail || hasPass) {
            completed++;
            if (hasFail) failed++;
            else if (hasPass) passed++;
          }
        }
      } else {
        // Parent check - traverse children
        c.subChecks.forEach(traverse);
      }
    };

    traverse(check);
    return { total, completed, passed, failed };
  }

  /**
   * Find parent check in the path that contains the current check
   */
  static findParentCheck(path: (Project | Check)[], currentCheck: Check): Check | null {
    for (let i = path.length - 2; i >= 0; i--) {
      const node = path[i];
      if ("subChecks" in node && node.subChecks) {
        if (node.subChecks.some(sub => sub.id === currentCheck.id)) {
          return node as Check;
        }
      }
    }
    return null;
  }
}

// ==========================================
// EMAIL SERVICE
// ==========================================
export class EmailService {
  /**
   * Send FAIL notification email immediately
   */
  static async sendFailNotificationEmail(
    checkName: string,
    breadcrumb: string,
    imageUrl?: string,
    formData?: {
      reasonForFailure?: string;
      processMiss?: boolean;
      technicalMiss?: boolean;
      correctiveMeasure?: string;
    }
  ): Promise<void> {
    const now = new Date().toLocaleString();
    const subject = `❌ Quality Check FAILED - ${checkName} | ${now}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #dc2626;">❌ Quality Check Failed</h1>
        <h2>${breadcrumb}</h2>
        <p><strong>Check:</strong> ${checkName}</p>
        <p><strong>Status:</strong> <span style="color: #dc2626; font-weight: bold;">FAILED</span></p>
        <p><strong>Time:</strong> ${now}</p>
        
        ${imageUrl ? `<p><img src="${imageUrl}" style="max-width:100%; border-radius: 8px; margin: 20px 0;"/></p>` : ""}
        
        <h3 style="color: #dc2626;">Failure Details</h3>
        <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="border: 1px solid #ddd; padding: 12px; background: #f9fafb; font-weight: bold;">Reason:</td>
            <td style="border: 1px solid #ddd; padding: 12px;">${formData?.reasonForFailure || "N/A"}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 12px; background: #f9fafb; font-weight: bold;">Process Miss:</td>
            <td style="border: 1px solid #ddd; padding: 12px;">${formData?.processMiss ? "✅ Yes" : "❌ No"}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 12px; background: #f9fafb; font-weight: bold;">Technical Miss:</td>
            <td style="border: 1px solid #ddd; padding: 12px;">${formData?.technicalMiss ? "✅ Yes" : "❌ No"}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 12px; background: #f9fafb; font-weight: bold;">Corrective Measure:</td>
            <td style="border: 1px solid #ddd; padding: 12px;">${formData?.correctiveMeasure || "N/A"}</td>
          </tr>
        </table>
        
        <p style="margin-top: 30px; padding: 15px; background: #fee2e2; border-left: 4px solid #dc2626; color: #991b1b;">
          ⚠️ <strong>Action Required:</strong> This check has failed and requires immediate attention.
        </p>
      </div>
    `;

    try {
      console.log("📧 Attempting to send FAIL email...");
      console.log("Email payload:", {
        to: "ganeshwebby@gmail.com",
        subject,
      });

      const response = await fetch(API_ENDPOINTS.EMAIL_SERVICE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "ganeshwebby@gmail.com",
          subject,
          html,
        }),
      });

      const responseData = await response.json();
      console.log("Email API Response:", responseData);

      if (!response.ok) {
        throw new Error(`Email service failed: ${response.status} - ${JSON.stringify(responseData)}`);
      }

      console.log("✅ Fail notification email sent successfully");
    } catch (error) {
      console.error("❌ Email sending failed:", error);
      // Don't throw - email failure shouldn't block submission
      Alert.alert("⚠️ Email Warning", "Check was saved, but email notification failed to send.");
    }
  }

  /**
   * Send main check completion email (only when all subchecks done)
   */
  static async sendMainCheckCompletionEmail(
    check: Check,
    project: Project,
    breadcrumb: string
  ): Promise<void> {
    const stats = CheckService.gatherCheckStats(check);
    const overallStatus = CheckService.getCheckOverallStatus(check);
    const passPercent =
      stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(1) : "0";

    const statusColor = overallStatus === "pass" ? "#16a34a" : "#dc2626";
    const statusIcon = overallStatus === "pass" ? "✅" : "❌";
    const statusText = overallStatus === "pass" ? "COMPLETED - ALL PASSED" : "COMPLETED - WITH FAILURES";

    const subject = `${statusIcon} ${check.label} - ${statusText} | ${project.title}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
        <div style="background: ${statusColor}; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 24px;">${statusIcon} Check Section Completed</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">${check.label}</p>
        </div>
        
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0;"><strong>Project:</strong> ${project.title}</p>
          <p style="margin: 10px 0 0 0;"><strong>Section Path:</strong> ${breadcrumb}</p>
        </div>
        
        <h2 style="color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Summary</h2>
        
        <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="border: 1px solid #e5e7eb; padding: 12px; background: #f9fafb; font-weight: bold; width: 40%;">Overall Status</td>
            <td style="border: 1px solid #e5e7eb; padding: 12px; color: ${statusColor}; font-weight: bold;">
              ${statusIcon} ${statusText}
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid #e5e7eb; padding: 12px; background: #f9fafb; font-weight: bold;">Total Checks</td>
            <td style="border: 1px solid #e5e7eb; padding: 12px;">${stats.total}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #e5e7eb; padding: 12px; background: #f9fafb; font-weight: bold;">Completed</td>
            <td style="border: 1px solid #e5e7eb; padding: 12px;">${stats.completed}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #e5e7eb; padding: 12px; background: #f9fafb; font-weight: bold;">✅ Passed</td>
            <td style="border: 1px solid #e5e7eb; padding: 12px; color: #16a34a; font-weight: bold;">${stats.passed}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #e5e7eb; padding: 12px; background: #f9fafb; font-weight: bold;">❌ Failed</td>
            <td style="border: 1px solid #e5e7eb; padding: 12px; color: #dc2626; font-weight: bold;">${stats.failed}</td>
          </tr>
          <tr style="background: #f0fdf4;">
            <td style="border: 1px solid #e5e7eb; padding: 12px; font-weight: bold;">Pass Rate</td>
            <td style="border: 1px solid #e5e7eb; padding: 12px; font-size: 18px; font-weight: bold; color: ${statusColor};">
              ${passPercent}%
            </td>
          </tr>
        </table>
        
        ${stats.failed > 0 ? `
          <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin-top: 20px; border-radius: 4px;">
            <p style="margin: 0; color: #991b1b;">
              <strong>⚠️ Attention Required:</strong> ${stats.failed} check(s) failed and need corrective action.
            </p>
          </div>
        ` : `
          <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 15px; margin-top: 20px; border-radius: 4px;">
            <p style="margin: 0; color: #166534;">
              <strong>✅ Excellent:</strong> All checks in this section passed successfully!
            </p>
          </div>
        `}
        
        <p style="margin-top: 40px; font-size: 12px; color: #6b7280; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          📅 Generated on ${new Date().toLocaleString()}
        </p>
      </div>
    `;

    try {
      const response = await fetch(API_ENDPOINTS.EMAIL_SERVICE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "ganeshwebby@gmail.com",
          subject,
          html,
        }),
      });

      if (!response.ok) {
        throw new Error("Email service failed");
      }

      console.log(`✅ Main check completion email sent for: ${check.label}`);
      Alert.alert(
        "✅ Section Complete", 
        `All checks in "${check.label}" are completed!\n\nCompletion report sent to admins.`
      );
    } catch (error) {
      console.error("❌ Email sending failed:", error);
      Alert.alert("⚠️ Email Failed", "Section complete but email notification failed.");
    }
  }

  /**
   * Send finishing report email
   */
  static async sendFinishingReportEmail(
    project: Project,
    passed: string[],
    failed: string[]
  ): Promise<void> {
    const total = passed.length + failed.length;
    const passPercent = total > 0 ? ((passed.length / total) * 100).toFixed(1) : "0";
    const subject = `📊 Finishing QC Report - ${project.title} (${passPercent}% Passed)`;

    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>🏗️ Finishing Quality Report - ${project.title}</h1>
        <p><strong>Total Checks:</strong> ${total}</p>
        <p><strong>✅ Passed:</strong> ${passed.length}</p>
        <p><strong>❌ Failed:</strong> ${failed.length}</p>
        <p><strong>Pass Percentage:</strong> ${passPercent}%</p>

        <h2>✅ Passed Checks</h2>
        <table style="width:100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr>
              <th style="border: 1px solid #ccc; padding: 8px;">#</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Check Name</th>
            </tr>
          </thead>
          <tbody>
            ${
              passed.length > 0
                ? passed
                    .map(
                      (check, i) =>
                        `<tr>
                          <td style="border: 1px solid #ccc; padding: 8px;">${i + 1}</td>
                          <td style="border: 1px solid #ccc; padding: 8px;">${check}</td>
                        </tr>`
                    )
                    .join("")
                : `<tr><td colspan="2" style="border: 1px solid #ccc; padding: 8px;">No checks passed</td></tr>`
            }
          </tbody>
        </table>

        <h2>❌ Failed Checks</h2>
        <table style="width:100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #ccc; padding: 8px;">#</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Check Name</th>
            </tr>
          </thead>
          <tbody>
            ${
              failed.length > 0
                ? failed
                    .map(
                      (check, i) =>
                        `<tr>
                          <td style="border: 1px solid #ccc; padding: 8px;">${i + 1}</td>
                          <td style="border: 1px solid #ccc; padding: 8px;">${check}</td>
                        </tr>`
                    )
                    .join("")
                : `<tr><td colspan="2" style="border: 1px solid #ccc; padding: 8px;">No checks failed</td></tr>`
            }
          </tbody>
        </table>

        <p style="margin-top: 40px; font-size: 12px; color: #888;">
          📅 Generated on ${new Date().toLocaleString()}
        </p>
      </div>
    `;

    try {
      const response = await fetch(API_ENDPOINTS.EMAIL_SERVICE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "ganeshwebby@gmail.com",
          subject,
          html,
        }),
      });

      if (!response.ok) {
        throw new Error("Email service failed");
      }

      Alert.alert("✅ Report Sent", "Finishing report sent successfully.");
      console.log("📧 Finishing report email sent");
    } catch (error) {
      console.error("❌ Failed to send finishing report:", error);
      Alert.alert("❌ Failed", "Could not send finishing report email.");
      throw error;
    }
  }
}

// ==========================================
// TEST MODE UTILITIES
// ==========================================
export class TestModeService {
  /**
   * Mark all leaf checks as PASS (for testing)
   */
  static markAllChecksAsPass(check: Check): number {
    let markedCount = 0;

    const traverse = (c: Check) => {
      if (!c.subChecks || c.subChecks.length === 0) {
        // Leaf check - mark as pass
        c.photos = [
          {
            status: "pass",
            image_url: "test://auto-marked",
            timestamp: new Date().toISOString(),
          },
        ];
        markedCount++;
      } else {
        // Parent check - traverse children
        c.subChecks.forEach(traverse);
      }
    };

    traverse(check);
    return markedCount;
  }

  /**
   * Clear all test data from a check
   */
  static clearTestData(check: Check): number {
    let clearedCount = 0;

    const traverse = (c: Check) => {
      if (c.photos && c.photos.length > 0) {
        const testPhotos = c.photos.filter((p) => p.image_url?.startsWith("test://"));
        if (testPhotos.length > 0) {
          c.photos = c.photos.filter((p) => !p.image_url?.startsWith("test://"));
          clearedCount += testPhotos.length;
        }
      }

      if (c.subChecks) {
        c.subChecks.forEach(traverse);
      }
    };

    traverse(check);
    return clearedCount;
  }
}