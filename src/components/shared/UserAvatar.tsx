import { Icons } from '@/components/shared/Icons'
import { Avatar, AvatarFallback } from '@/components/ui/Avatar'
import { AvatarProps } from '@radix-ui/react-avatar'
import { User } from 'next-auth'
import Image from 'next/image'

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, 'image' | 'name'>
}

export function UserAvatar({ user, ...props }: UserAvatarProps): JSX.Element {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="relative aspect-square h-full w-full">
          <Image src={user.image} alt="Profile Picture" referrerPolicy="no-referrer" fill />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.name}</span>
          <Icons.User className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  )
}
