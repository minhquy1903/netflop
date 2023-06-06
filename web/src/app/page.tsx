import Image from "next/image";
import VideoPlayer from "_@/components/video/VideoPlayer";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<VideoPlayer src="https://d1auhj9vn0ri57.cloudfront.net/Custonomy%20%E2%80%94%20Mozilla%20Firefox%202023-04-07%2017-43-24.mp4" />
		</main>
	);
}
