import { User } from "../../../types/interfaces/user";
import { PermissionEnum } from "../../../types/enums/permission-enum";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface UserCardProps {
  user: User;
  permission: PermissionEnum;
  onRemove: () => void;
}

const UserCard = ({ user, permission, onRemove }: UserCardProps) => {
  return (
    <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-medium">
            {user.email.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{user.email}</p>
          <p className="text-xs text-gray-500">
            {permission === PermissionEnum.READ ? "Can read" : "Can edit"}
          </p>
        </div>
      </div>
      <button
        onClick={onRemove}
        className="p-1 rounded-full hover:bg-gray-200"
        title="Remove user"
      >
        <XMarkIcon className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
};

export default UserCard; 