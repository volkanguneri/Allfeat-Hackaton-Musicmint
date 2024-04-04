import Link from "next/link";

const Navbar = () => {
  return (
    <nav>
      <ul className="flex items-center justify-center gap-10">
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/album">Album</a>
        </li>
        <li>
          <a href="/admin">Admin</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
