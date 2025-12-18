// Announcement Manager - Handles real-time announcements via Firebase

class AnnouncementManager {
  constructor() {
    this.currentAnnouncement = null;
    this.listeners = [];
  }

  // Initialize and listen to Firebase
  init() {
    // Listen for announcement changes
    database.ref('announcement').on('value', (snapshot) => {
      this.currentAnnouncement = snapshot.val();
      this.notifyListeners();
    });
  }

  // Add listener for when announcement changes
  addListener(callback) {
    this.listeners.push(callback);
  }

  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentAnnouncement));
  }

  // Create or update announcement
  async setAnnouncement(announcement) {
    const announcementData = {
      title: announcement.title,
      content: announcement.content,
      icon: announcement.icon || null,
      buttonText: announcement.buttonText || 'OK',
      buttonLink: announcement.buttonLink || null,
      createdAt: Date.now()
    };
    await database.ref('announcement').set(announcementData);
  }

  // Clear announcement
  async clearAnnouncement() {
    await database.ref('announcement').remove();
  }

  // Get current announcement
  getCurrentAnnouncement() {
    return this.currentAnnouncement;
  }
}

// Create global instance
const announcementManager = new AnnouncementManager();
