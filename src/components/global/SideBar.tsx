import NavLinks from "./NavLinks";
import SignOutButton from "./SignOutButton";

export default async function SideBar() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="flex grow flex-row justify-between p-4 space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <div className="sticky top-0 h-auto p-4 bg-white shadow-md md:sticky md:top-0">
          <NavLinks />
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
