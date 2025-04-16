import React from 'react';

const notifications = [
  { id: 1, message: "New debate starting in 5 minutes!", time: "Just now" },
  { id: 2, message: "Climate Change debate reached 100 participants!", time: "2m ago" },
  { id: 3, message: "AI Ethics debate registration open", time: "5m ago" },
  { id: 4, message: "Space Exploration debate concluded", time: "10m ago" },
];

function NotificationBar() {
  return (
    <div className="fixed right-0 top-18 bottom-0   w-80 bg-white shadow-lg overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Recent Updates</h2>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow transition-shadow duration-200"
            >
              <p className="text-gray-700">{notification.message}</p>
              <span className="text-sm text-gray-500 mt-2 block">{notification.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NotificationBar;
