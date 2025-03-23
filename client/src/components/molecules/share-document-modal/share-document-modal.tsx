import {
  ChangeEvent,
  KeyboardEvent,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import { DocumentContext } from "../../../contexts/document-context";
import useAuth from "../../../hooks/use-auth";
import { ToastContext } from "../../../contexts/toast-context";
import validator from "validator";
import { PermissionEnum } from "../../../types/enums/permission-enum";
import DocumentUserService from "../../../services/document-user-service";
import DocumentUser from "../../../types/interfaces/document-user";
import DocumentInterface from "../../../types/interfaces/document";
import Modal from "../../atoms/modal/modal";
import { LinkIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import SharedUsers from "../shared-users/shared-users";
import Spinner from "../../atoms/spinner/spinner";
import DocumentService from "../../../services/document-service";
import { User } from "../../../types/interfaces/user";
import UserCard from "../../atoms/user-card/user-card";

interface ShareDocumentModalProps {
  documentId: number;
  isOpen: boolean;
  onClose: () => void;
}

const ShareDocumentModal = ({
  documentId,
  isOpen,
  onClose,
}: ShareDocumentModalProps) => {
  const { document, saving, saveDocument, setDocument } =
    useContext(DocumentContext);
  const copyLinkInputRef = useRef<null | HTMLInputElement>(null);
  const [email, setEmail] = useState<null | string>(null);
  const { accessToken } = useAuth();
  const { success, error } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);
  const [sharedUsers, setSharedUsers] = useState<DocumentUser[]>([]);

  useEffect(() => {
    if (accessToken && documentId) {
      loadSharedUsers();
    }
  }, [accessToken, documentId]);

  const loadSharedUsers = async () => {
    try {
      const response = await DocumentService.getSharedUsers(accessToken!, documentId);
      setSharedUsers(response.data);
    } catch (err) {
      error("Failed to load shared users");
    }
  };

  const shareDocument = async () => {
    if (
      email === null ||
      !validator.isEmail(email) ||
      accessToken === null ||
      document === null
    )
      return;

    const payload = {
      documentId: document.id,
      email: email,
      permission: PermissionEnum.WRITE,
    };

    setLoading(true);

    try {
      const response = await DocumentUserService.create(accessToken, payload);
      const documentUser = response.data as DocumentUser;
      documentUser.user = { email };

      success(`Successfully shared document with ${email}`);

      setDocument({
        ...document,
        users: [...document.users, documentUser],
      } as DocumentInterface);
      setEmail("");
      await loadSharedUsers();
    } catch (err) {
      error(`Unable to share this document with ${email}. Please try again`);
    } finally {
      setLoading(false);
    }
  };

  const handleShareEmailInputChange = (event: ChangeEvent) => {
    setEmail((event.target as HTMLInputElement).value);
  };

  const handleCopyLinkBtnClick = () => {
    if (copyLinkInputRef === null || copyLinkInputRef.current === null) return;

    const url = window.location.href;
    copyLinkInputRef.current.value = url;
    copyLinkInputRef.current.focus();
    copyLinkInputRef.current.select();
    window.document.execCommand("copy");
  };

  const handleOnKeyPress = async (event: KeyboardEvent) => {
    if (event.key === "Enter") await shareDocument();
  };

  const updateIsPublic = (isPublic: boolean) => {
    const updatedDocument = {
      ...document,
      isPublic: isPublic,
    } as DocumentInterface;

    saveDocument(updatedDocument);
  };

  const handleShareBtnClick = async () => {
    await shareDocument();
  };

  const alreadyShared =
    document === null ||
    (document !== null &&
      document.users.filter((documentUser) => documentUser.user.email === email)
        .length > 0);

  const publicAccessBtn = (
    <div className="space-y-1">
      <button
        disabled={saving}
        onClick={() => updateIsPublic(false)}
        className="font-semibold text-blue-600 p-2 hover:bg-blue-50 rounded-md"
      >
        {saving && <Spinner size="sm" />}
        <span className={`${saving && "opacity-0"}`}>
          Change to only shared users
        </span>
      </button>
      <p className="mx-2">
        <b className="font-semibold">Public</b>
        <span className="text-gray-600">Anyone with this link can view</span>
      </p>
    </div>
  );

  const restrictedAccessBtn = (
    <div className="space-y-1">
      <button
        disabled={saving}
        onClick={() => updateIsPublic(true)}
        className="font-semibold text-blue-600 p-2 hover:bg-blue-50 rounded-md"
      >
        {saving && <Spinner size="sm" />}
        <span className={`${saving && "opacity-0"}`}>
          Change to anyone with the link
        </span>
      </button>
      <p className="mx-2">
        <b className="font-semibold">Restricted</b>
        <span className="text-gray-600">
          Only people added can open with this link
        </span>
      </p>
    </div>
  );

  const handleUnshare = async (userId: number) => {
    try {
      await DocumentService.unshareDocument(accessToken!, documentId, userId);
      success("Document unshared successfully");
      await loadSharedUsers();
    } catch (err) {
      error("Failed to unshare document");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Document">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <TextField
            value={email}
            onInput={setEmail}
            placeholder="Enter email address"
            icon={<UserPlusIcon className="w-5 h-5" />}
          />
          <button
            onClick={handleShareBtnClick}
            disabled={
              loading ||
              email === null ||
              !validator.isEmail(email) ||
              alreadyShared
            }
            className={`${
              email === null || !validator.isEmail(email) || alreadyShared
                ? "btn-disabled"
                : "btn-primary"
            } px-4 py-2`}
          >
            {loading && <Spinner size="sm" />}
            <span className={`${loading && "opacity-0"}`}>Share</span>
          </button>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-2">Shared with</h3>
          <div className="space-y-2">
            {sharedUsers.map((documentUser) => (
              <UserCard
                key={documentUser.id}
                user={documentUser.user}
                permission={documentUser.permission}
                onRemove={() => handleUnshare(documentUser.userId)}
              />
            ))}
            {sharedUsers.length === 0 && (
              <p className="text-sm text-gray-500">No users shared with yet</p>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
            <LinkIcon className="w-5 h-5" />
            <span>Copy link</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareDocumentModal;
