export default function FeedbackResponseTemplates() {
  // Mock data for response templates
  const templates = [
    {
      id: 1,
      title: "Positive Feedback Response",
      content:
        "Thank you for your positive feedback! We're delighted to hear that you enjoyed our services. Your satisfaction is our priority, and we look forward to serving you again soon.",
    },
    {
      id: 2,
      title: "Service Issue Apology",
      content:
        "We sincerely apologize for the inconvenience you experienced. We take your feedback seriously and are working to address the issues you've raised. A manager will contact you shortly to discuss this further.",
    },
    {
      id: 3,
      title: "Follow-up Request",
      content:
        "Thank you for sharing your experience with us. To better address your concerns, could you provide more details about your visit? This will help us improve our services and ensure a better experience in the future.",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex flex-row items-center justify-between">
        <h3 className="font-medium">Response Templates</h3>
        <button className="bg-primary text-white px-3 py-1 rounded-md text-sm flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Template
        </button>
      </div>
      <div className="p-4 space-y-4">
        {templates.map((template) => (
          <div key={template.id} className="border rounded-md p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{template.title}</h3>
              <div className="flex gap-2">
                <button className="text-gray-500 hover:text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500">{template.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
