import { useGameStore } from '../../store/gameStore'
import { ArticulatedAvatar } from './ArticulatedAvatar'

export function FriendAvatar() {
  const { connectedFriend } = useGameStore()

  if (!connectedFriend) return null

  return <ArticulatedAvatar friend={connectedFriend} />
}
