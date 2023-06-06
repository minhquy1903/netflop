"use client";

import React, { useEffect, useState } from "react";

type VideoPlayerProps = {
	src: string;
};

const VideoPlayer = ({ src }: VideoPlayerProps) => {
	const [video, setVideo] = useState<React.ReactElement>();

	useEffect(() => {
		setVideo(
			<video className="h-[687px]" autoPlay={true} controls>
				<source type="video/mp4" src={src} />
			</video>,
		);
	}, [src]);

	return <div>{video}</div>;
};

export default VideoPlayer;
