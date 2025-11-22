import VideoPlayer from '@/components/Video-Player/VideoPlayer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
    return (
        <VideoPlayer />
    )
}
