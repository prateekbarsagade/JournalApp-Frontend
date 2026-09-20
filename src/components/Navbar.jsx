// import { NavLink } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const linkClass = ({ isActive }) =>
//   `text-sm font-medium px-3 py-2 rounded-lg transition ${
//     isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
//   }`;

// export default function Navbar() {
//   const { user, logout } = useAuth();

//   if (!user) return null;

//   return (
//     <nav className="bg-white border-b border-gray-200">
//       <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
//         <div className="flex items-center gap-1">
//           <NavLink to="/journal" className={linkClass}>
//             Journal
//           </NavLink>
//           <NavLink to="/profile" className={linkClass}>
//             Profile
//           </NavLink>
//           <NavLink to="/admin" className={linkClass}>
//             Admin
//           </NavLink>
//         </div>
//         <div className="flex items-center gap-4">
//           <span className="text-sm text-gray-500">{user.username}</span>
//           <button onClick={logout} className="text-sm text-red-600 hover:underline">
//             Log out
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }

import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linkClass = ({ isActive }) =>
  `text-sm font-medium px-3 py-2 rounded-lg transition ${
    isActive
      ? "bg-blue-100 text-blue-700"
      : "text-gray-600 hover:bg-gray-100"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const isAdmin = user.role?.[0] === "ADMIN";
  console.log(isAdmin)

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">

        <div className="flex items-center gap-1">

          {/* Show Journal only for normal users */}
          {!isAdmin && (
            <NavLink to="/journal" className={linkClass}>
              Journal
            </NavLink>
          )}

          {/* Both users and admins can see Profile */}
          <NavLink to="/profile" className={linkClass}>
            Profile
          </NavLink>

          {/* Show Admin only for admins */}
          {isAdmin && (
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          )}

        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {user.username}
          </span>

          <button
            onClick={logout}
            className="text-sm text-red-600 hover:underline"
          >
            Log out
          </button>
        </div>

      </div>
    </nav>
  );
}
