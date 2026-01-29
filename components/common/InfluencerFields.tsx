export default function InfluencerFields({ value, onChange }: any) {
  return (
    <div className="space-y-3">
      <input
        placeholder="Influencer Name"
        value={value.name || ""}
        onChange={e => onChange({ ...value, name: e.target.value })}
        className="border p-2 w-full"
      />

      <input
        placeholder="Instagram Reel / Video URL"
        value={value.videoUrl || ""}
        onChange={e => onChange({ ...value, videoUrl: e.target.value })}
        className="border p-2 w-full"
      />

      <input
        placeholder="Product IDs (comma separated)"
        value={value.productIds || ""}
        onChange={e => onChange({ ...value, productIds: e.target.value })}
        className="border p-2 w-full"
      />
    </div>
  );
}
