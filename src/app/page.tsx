import InterviewPanel from './components/interviewPanel';

import Landing from "./landing";

export default function Home() {

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <div>
        <InterviewPanel/>
        <Landing/>
      </div>
    </main>
  );
}
