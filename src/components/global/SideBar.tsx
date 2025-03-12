import NavLinks from "./NavLinks";
import SignOutButton from "./SignOutButton";

export default function SideBar() {
  return (
    <div className="flex h-screen w-1/4 flex-col px-3 py-4 md:px-6 bg-white  md:w-fit md:space-x-0 md:space-y-2">
      <div className="flex flex-col justify-between h-full overflow-y-auto shadow-md md:px-8">
        <NavLinks />
        <SignOutButton />
      </div>
    </div>
  );
}
