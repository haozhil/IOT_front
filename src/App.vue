<template>
  <div class="header">
    <img
      src="./assets/img/medicine-box.png"
      alt="Cartoon Medicine Box"
      class="medicine-box"
    />
    <div class="temperature">Temperature: {{ temperature }}</div>
    <h1>Smart Medicine Box</h1>
    <div class="team-info">
      <p>Development Team: Group 1</p>
      <p>Contact: team@example.com</p>
    </div>
  </div>
  <div class="main-content">
    <!-- Sidebar for user info -->
    <div class="sidebar">
      <div class="info_main">
        <div class="side_info">
          <h2>User Information</h2>
          <p>Name: {{ user.name }}</p>
          <p>Age: {{ user.age }}</p>
          <p>Contact: {{ user.contact }}</p>
        </div>
      </div>
      <div class="user_button">
        <button class="button" @click="openUserInfoModal">Update</button>
      </div>
    </div>

    <div class="AB_container">
      <!-- Medication A -->
      <div class="medication-box" id="medicationA">
        <div class="med_img">
          <img
            src="./assets/img/medicine-box.png"
            alt="Cartoon Medicine Box"
            class="medicine-box"
          />
        </div>
        <div class="med_info">
          <div class="med_content">
            <h2>{{ getPillById(1).name }}</h2>
            <p>Next Dose Time: {{ nextReminder_1 }}</p>
            <p>Dose Amount: {{ getPillById(1).doseAmount }}</p>
            <p>Remaining Quantity: {{ getPillById(1).initialQuantity }}</p>
          </div>
          <button class="button med_button" @click="openModal(1)">
            Update
          </button>
        </div>
      </div>

      <!-- Medication B -->
      <div class="medication-box" id="medicationB">
        <div class="med_img">
          <img
            src="./assets/img/medicine-box.png"
            alt="Cartoon Medicine Box"
            class="medicine-box"
          />
        </div>
        <div class="med_info">
          <div class="med_content">
            <h2>{{ getPillById(2).name }}</h2>
            <p>Next Dose Time: {{ nextReminder_2 }}</p>
            <p>Dose Amount: {{ getPillById(2).doseAmount }}</p>
            <p>Remaining Quantity: {{ getPillById(2).initialQuantity }}</p>
          </div>
          <button class="button med_button" @click="openModal(2)">
            Update
          </button>
        </div>
      </div>
    </div>

    <!-- Medication Information popup window -->
    <div class="modal" v-if="isModalOpen">
      <div class="modal-content">
        <h2>Update</h2>
        <form @submit.prevent="submitMedicationForm">
          <div class="form-group">
            <label for="med_name">Medicine name</label>
            <input
              type="text"
              v-model="tempMedicationForm.name"
              id="medName"
              name="medName"
              required
            />
          </div>
          <div class="form-group">
            <label for="quantity">Quantity</label>
            <input
              type="number"
              v-model="tempMedicationForm.quantity"
              id="quantity"
              name="quantity"
              min="0"
              required
            />
          </div>
          <div class="form-group">
            <label :for="'time' + index">Dosage Time</label>
            <div class="checkbox-grid">
              <div
                v-for="(hour, index) in hours"
                :key="index"
                class="checkbox-item"
              >
                <input
                  type="checkbox"
                  :id="'time' + index"
                  :value="hour"
                  v-model="tempMedicationForm.doseTimes"
                />
                <label :for="'time' + index">{{ hour }}</label>
              </div>
            </div>
          </div>
          <div class="form-group">
            <!-- Display user's selecting time -->
            <div class="selected-times">
              <p>Selected Times:</p>
              <p v-if="tempMedicationForm.doseTimes.length > 0">
                <strong>{{ tempMedicationForm.doseTimes.join(", ") }}</strong>
              </p>
              <strong v-else>No times selected</strong>
            </div>
          </div>
          <div class="form-group">
            <label for="doseAmount">Single Dose Amount</label>
            <input
              type="number"
              v-model="tempMedicationForm.doseAmount"
              id="doseAmount"
              name="doseAmount"
              min="0"
              required
            />
          </div>
          <div class="modal-buttons">
            <button type="submit">Submit</button>
            <button type="button" class="cancel-button" @click="closeModal">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- User Information popup window -->
  <div class="modal" v-if="isUserInfoModalOpen">
    <div class="modal-content">
      <h2>{{ modalTitle_user }}</h2>
      <form @submit.prevent="submitUserInfo">
        <div class="form-group">
          <label for="userName">Name</label>
          <input
            type="text"
            v-model="tempUserForm.name"
            id="userName"
            name="userName"
            value="Enter your name"
            required
          />
        </div>
        <div class="form-group">
          <label for="userAge">Age</label>
          <input
            type="number"
            v-model="tempUserForm.age"
            id="userAge"
            name="userAge"
            min="0"
            required
          />
        </div>
        <div class="form-group">
          <label for="userContact">Contact</label>
          <input
            type="text"
            v-model="tempUserForm.contact"
            id="userContact"
            name="userContact"
            required
          />
        </div>
        <div class="modal-buttons">
          <button type="submit">Submit</button>
          <button
            type="button"
            class="cancel-button"
            @click="closeModalUserInfo"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      // Control the modal display state
      isModalOpen: false, // Controls the medication information modal
      isUserInfoModalOpen: false, // Controls the user information modal

      // Modal titles
      modalTitle_pill: "Update Medication",
      modalTitle_user: "Update User Info",
      nextReminder_1: "", // Next reminder time for medication 1
      nextReminder_2: "", // Next reminder time for medication 2
      temperature: 0,
      hours: [
        "0:00",
        "1:00",
        "2:00",
        "3:00",
        "4:00",
        "5:00",
        "6:00",
        "7:00",
        "8:00",
        "9:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
      ], // List of time slots

      // User form data (used for final submission)
      user: {
        name: "Zhang San",
        age: 65,
        contact: "123-456-7890",
      },
      // Temporary form data (used for display when the modal is opened)
      tempUserForm: {
        name: "",
        age: "",
        contact: "",
      },
      pills: [],

      // Temporary form data (used for display when the modal is opened)
      tempMedicationForm: {
        id: 0,
        name: "",
        quantity: "",
        doseAmount: "",
        doseTimes: [], // Stores the dose times selected by the user
      },
    };
  },
  mounted() {
    this.fetchPills();
    this.fetchTemperature();
    // Periodically refresh data
    // setInterval(this.fetchTemperature, 5000); // Request temperature every 5 seconds
  },
  methods: {
    fetchTemperature() {
      axios
        .get("/tempServlet")
        .then((response) => {
          // Directly retrieve data from response.data, axios automatically parses JSON
          this.temperature = response.data.temperature;
        })
        .catch((error) => {
          // Handle request errors
          console.error("Error fetching temperature:", error);
        });
    },
    fetchPills() {
      axios
        .get("/getPills")
        .then((response) => {
          this.pills = response.data; // Store the returned Pill array into pills

          this.calculateNextReminder(); // After fetching data, calculate the next reminder time for each medication
        })
        .catch((error) => {
          console.error("Error fetching pills:", error);
        });
    },
    getPillById(id) {
      // Get pill object by id
      return this.pills.find((p) => p.id === id) || {}; // Return an empty object if not found
    },
    // Calculate the next reminder time for each medication
    calculateNextReminder() {
      const now = new Date(); // Get current time
      const currentDate = now.toISOString().split("T")[0]; // Get current date part, e.g., "2024-09-25"

      // Process medication 1
      if (this.pills.length > 0 && this.pills[0].doseTimes) {
        this.nextReminder_1 = this.getNextReminderForPill(
          this.pills[0],
          currentDate,
          now
        );
      }

      // Process medication 2
      if (this.pills.length > 1 && this.pills[1].doseTimes) {
        this.nextReminder_2 = this.getNextReminderForPill(
          this.pills[1],
          currentDate,
          now
        );
      }
    },
    // Calculate the next reminder time for a specific medication
    getNextReminderForPill(pill, currentDate, now) {
      let nextReminder = "";

      // Iterate over each reminder time for the medication
      for (let i = 0; i < pill.doseTimes.length; i++) {
        const timeString = pill.doseTimes[i]; // e.g., "10:00"
        const dateTimeString = `${currentDate} ${timeString}:00`; // Concatenate to a complete datetime string "2024-09-25 10:00:00"

        // Create a JavaScript Date object
        const reminderTime = new Date(dateTimeString);

        // If reminderTime is after the current time, find the next reminder time
        if (reminderTime > now) {
          nextReminder = reminderTime.toLocaleString(); // Set the next reminder time for the medication
          return nextReminder; // Return the time once found
        }
      }

      // If all time slots for the day have passed, show the first reminder time for tomorrow
      if (!nextReminder) {
        const tomorrowDate = new Date(now);
        tomorrowDate.setDate(now.getDate() + 1); // Get the date for tomorrow
        const firstDoseTime = `${tomorrowDate.toISOString().split("T")[0]} ${
          pill.doseTimes[0]
        }:00`;
        nextReminder = new Date(firstDoseTime).toLocaleString(); // Set the first reminder time for tomorrow
      }

      return nextReminder;
    },
    // Open the medication information modal and initialize form data
    openModal(medicationId) {
      this.tempMedicationForm.id = medicationId;
      this.tempMedicationForm.name = "";

      // Reset form data to empty to avoid showing preset values
      this.tempMedicationForm.quantity = "";
      this.tempMedicationForm.doseAmount = "";
      this.tempMedicationForm.doseTimes = [];
      this.isModalOpen = true;
    },
    // Close the medication information modal
    closeModal() {
      this.isModalOpen = false;
    },
    // Submit the medication information form
    submitMedicationForm() {
      // Assume the form data is packaged into a medication object pill
      const pill = {
        id: this.tempMedicationForm.id,
        name: this.tempMedicationForm.name,
        initialQuantity: this.tempMedicationForm.quantity,
        doseTimes: this.tempMedicationForm.doseTimes, // Selected times
        doseAmount: this.tempMedicationForm.doseAmount,
      };

      // Call the backend API to send the pill object data
      axios
        .post("/updatePill", pill)
        .then((response) => {
          console.log("Pill information updated successfully:", response.data);
          this.closeModal(); // Close the modal
          // Add additional logic here, such as refreshing the medication list or notifying the user of success
          this.fetchPills();
        })
        .catch((error) => {
          console.error("Error updating pill information:", error);
          // Handle errors here, such as displaying error messages to the user
          this.closeModal;
        });
    },

    // Open the user information modal
    openUserInfoModal() {
      this.tempUserForm.name = "";
      this.tempUserForm.age = "";
      this.tempUserForm.contact = "";
      this.isUserInfoModalOpen = true;
    },
    // Close the user information modal
    closeModalUserInfo() {
      this.isUserInfoModalOpen = false;
    },

    // Submit the user information form
    submitUserInfo() {
      // Update user information when submitting
      // Save to sessionStorage

      this.user.name = this.tempUserForm.name;
      this.user.age = this.tempUserForm.age;
      this.user.contact = this.tempUserForm.contact;

      console.log("Updated User Info:", this.user);
      this.closeModalUserInfo(); // Close the modal after submission
    },
    // Close the medication ID modal
    closeModalMedicineID() {
      this.isMedicineIDModalOpen = false;
    },
    // Open the medication ID modal
    openMedicineIDModal() {
      this.isMedicineIDModalOpen = true;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
