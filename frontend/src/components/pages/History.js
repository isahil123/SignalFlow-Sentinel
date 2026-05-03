const History = () => (
  <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
    <h2 className="text-2xl font-bold mb-4 text-blue-400">Alert History</h2>
    <p className="text-gray-400 italic">
      No alerts triggered in the last 24 hours.
    </p>
    {/* Later, we can map through an 'alerts' collection from MongoDB here */}
  </div>
);
export default History;
