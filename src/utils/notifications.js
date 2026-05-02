// src/utils/notifications.js

const APP_URL = "https://dsavault-bc0a8.web.app/dashboard"

// ── Check if browser supports notifications ──
export function isNotificationSupported() {
  return "Notification" in window
}

// ── Get current permission status ──
export function getPermissionStatus() {
  if (!isNotificationSupported()) return "unsupported"
  return Notification.permission // "default" | "granted" | "denied"
}

// ── Request permission from user ──
export async function requestNotificationPermission() {
  if (!isNotificationSupported()) return false
  const permission = await Notification.requestPermission()
  return permission === "granted"
}

// ── Fire a notification ──
export function sendNotification(title, body, tag = "neurodsa") {
  if (!isNotificationSupported()) return
  if (Notification.permission !== "granted") return

  const notification = new Notification(title, {
    body,
    tag,                    // prevents duplicate notifications
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    requireInteraction: false,
  })

  // Click → open dashboard
  notification.onclick = () => {
    window.focus()
    window.location.href = APP_URL
    notification.close()
  }
}

// ── Main function — check due questions and notify ──
export function checkAndNotify(questions) {
  if (!isNotificationSupported()) return
  if (Notification.permission !== "granted") return

  const today = new Date().toISOString().split("T")[0]

  const due = questions.filter(
    (q) => !q.completed && q.nextRevisionDate <= today
  )

  if (due.length === 0) return

  const overdue = due.filter((q) => q.nextRevisionDate < today)
  const dueToday = due.filter((q) => q.nextRevisionDate === today)

  // Build smart message
  let body = ""
  if (overdue.length > 0 && dueToday.length > 0) {
    body = `${dueToday.length} due today + ${overdue.length} overdue. Don't skip!`
  } else if (overdue.length > 0) {
    body = `${overdue.length} overdue question${overdue.length > 1 ? "s" : ""}. Catch up now!`
  } else {
    body = `${dueToday.length} question${dueToday.length > 1 ? "s" : ""} to revise today. Keep the streak!`
  }

  sendNotification("NeuroDSA ", body)
}

// ── Store last notified date to avoid spam ──
export function hasNotifiedToday() {
  const last = localStorage.getItem("neurodsa_last_notified")
  const today = new Date().toISOString().split("T")[0]
  return last === today
}

export function markNotifiedToday() {
  const today = new Date().toISOString().split("T")[0]
  localStorage.setItem("neurodsa_last_notified", today)
}