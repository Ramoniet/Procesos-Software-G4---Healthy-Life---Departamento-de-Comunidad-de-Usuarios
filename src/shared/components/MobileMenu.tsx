import { Navbar } from './Navbar.tsx';
import { UserProfile } from './UserProfile.tsx';

export function MobileMenu() {
  return (
    <div className="md:hidden border-t border-gray-200 px-4 py-3 flex flex-col gap-1">
      <Navbar direction="col" />
      <UserProfile className="mt-3 pt-3 border-t border-gray-200" reverse />
    </div>
  );
}
