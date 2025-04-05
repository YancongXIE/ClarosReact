import { DeleteButton } from "../../../components/ui/Buttons";
import { kAPI_URL } from '../../../api/utils/constants';

const DeleteAccount = () => {
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmed) {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const response = await fetch(`${kAPI_URL}/users/delete`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to delete your account.");
        }

        if (data.success) {
          alert("Your account has been deleted successfully.");
          localStorage.removeItem("token"); // Remove token from localStorage
          // Redirect the user to landing page
          window.location.href = "/";
        } else {
          alert("Failed to delete your account. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        alert(
          "An error occurred while deleting your account. Please try again."
        );
      }
    }
  };

  return (
    <div className="form-control mt-3">
      <DeleteButton
        textColor={"text-primary-content -auto inline-block"}
        onClick={handleDelete}
      >
        Delete Account
      </DeleteButton>
    </div>
  );
};

export default DeleteAccount;
