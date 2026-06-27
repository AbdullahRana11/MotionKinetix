'use client';

interface JointAngleRow {
  frame: number;
  joint_name: string;
  angle: number;
}

interface TelemetryTableProps {
  rows: JointAngleRow[];
}

export default function TelemetryTable({ rows }: TelemetryTableProps) {
  return (
    <div className="mt-4 max-h-[400px] overflow-auto rounded-xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="sticky top-0 glass-liquid border-b border-white/10">
            <th className="px-4 py-3 font-medium uppercase tracking-widest text-white/60 text-crisp">
              Frame
            </th>
            <th className="px-4 py-3 font-medium uppercase tracking-widest text-white/60 text-crisp">
              Metric
            </th>
            <th className="px-4 py-3 font-medium uppercase tracking-widest text-white/60 text-crisp">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className="border-b border-white/5 transition-colors hover:bg-white/5"
            >
              <td className="px-4 py-2 text-center font-mono text-crisp">
                {row.frame}
              </td>
              <td className="px-4 py-2 text-center text-crisp">{row.joint_name}</td>
              <td className="px-4 py-2 text-center font-mono text-primary-400 text-crisp">
                {row.angle}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
