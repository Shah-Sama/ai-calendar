import Calendar from "./components/Calendar";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-6">
      <main className="mx-auto max-w-6xl rounded-xl bg-white dark:bg-zinc-900 shadow p-6">
        <h1 className="text-2xl font-semibold mb-4 text-black dark:text-white">
          My Calendar
        </h1>
        <Calendar />
      </main>
    </div>
  );
}
