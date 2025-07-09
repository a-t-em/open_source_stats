// Simulated login state
const isLoggedIn = true; // Change to false to simulate logged out
const user = {
profilePic: "images/pikachu.png" // Placeholder image
};

const userSection = document.getElementById("user-section");

if (isLoggedIn) {
userSection.innerHTML = `
  <a href="src/profile.html" style="display: flex; align-items: center; gap: 8px;">
    <img src="${user.profilePic}" alt="Profile" style="width: 30px; height: 30px; border-radius: 50%;">
    <span style="color: teal; font-weight: bold;">My Profile</span>
  </a>
`;
} else {
userSection.innerHTML = `
  <a href="src/login.html" style="color: teal; font-weight: bold;">Login</a>
`;
}
