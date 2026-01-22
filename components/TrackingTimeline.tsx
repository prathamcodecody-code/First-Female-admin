type Scan = {
  time: string;
  location: string;
  activity: string;
  status: string;
};

export default function TrackingTimeline({
  scans,
}: {
  scans: Scan[];
}) {
  if (!scans?.length) {
    return (
      <p className="text-sm text-gray-500">
        Tracking information not available yet.
      </p>
    );
  }

  return (
    <ol className="border-l pl-4 space-y-4">
      {scans.map((scan, i) => (
        <li key={i}>
          <p className="text-sm font-semibold">
            {scan.status}
          </p>
          <p className="text-xs text-gray-500">
            {scan.location} ·{" "}
            {new Date(scan.time).toLocaleString()}
          </p>
          <p className="text-xs text-gray-600">
            {scan.activity}
          </p>
        </li>
      ))}
    </ol>
  );
}
