document
  .getElementById("contactForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = {
      name: document.getElementById("name").value,
      phoneNumber: document.getElementById("phoneNumber").value,
      age: document.getElementById("age").value,
      district: document.getElementById("district").value,
      issues: Array.from(
        document.querySelectorAll('input[name="issues"]:checked')
      ).map((checkbox) => checkbox.value),
      dream: document.getElementById("dream").value,
    };

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      alert(result.message);
      document.getElementById("contactForm").reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form");
    }
  });
