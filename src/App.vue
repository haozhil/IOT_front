<template>
  <div id="main">
    <el-alert
      title="Current temperature is too high!"
      type="error"
      center
      v-if="temperature > maxTemp"
    />
    <div class="header">
      <img
        src="./assets/img/medicine-box.png"
        alt="Cartoon Medicine Box"
        class="medicine-box"
      />
      <div class="temperature">
        Temperature: {{ temperature }}
        <div class="maxTemperature">Max Temperature allowed: {{ maxTemp }}</div>
        <el-button
          type="success"
          style="margin-left: 16px"
          @click="drawer = true"
        >
          Set Max Temperature
        </el-button>
      </div>

      <!-- Drawer -->
      <el-drawer v-model="drawer" title="Set Temperature" direction="ltr">
        <!-- Slider -->
        <div class="slider-demo-block">
          <el-slider v-model="value" :min="10" :max="60" show-input />
        </div>

        <!-- Submit -->
        <el-button
          type="primary"
          style="margin-top: 20px"
          :loading="loading"
          @click="submitValue"
        >
          {{ loading ? "Submitting ..." : "Submit" }}
        </el-button>
      </el-drawer>
      <h1>Smart Medicine Box</h1>
      <div class="team-info">
        <p>Development Team: Group 1</p>
        <p>Contact: 26184956@gmail.com</p>
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
            <el-empty
              description="No medication data"
              :image-size="100"
              v-if="getPillById(1).initialQuantity == null"
            />
            <div class="med_content" v-else>
              <h2>{{ getPillById(1).name }}</h2>
              <p>Next Dose Time: {{ nextReminder_1 }}</p>
              <p>Dose Amount: {{ getPillById(1).doseAmount }}</p>
              <p>Remaining Quantity: {{ RemainWeight1 }}</p>
              <p>Last taken time: {{ lastTimeTaken1 }}</p>
            </div>
            <!-- Update button and menu -->
            <el-dropdown split-button type="primary" @click="preOrNew(1)">
              Update
              <template #dropdown>
                <el-dropdown-menu>
                  <!-- menu option：check history -->
                  <el-dropdown-item @click="showHistory = true">
                    View Medication History
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
            <el-empty
              description="No medication data"
              :image-size="100"
              v-if="getPillById(2).initialQuantity == null"
            />
            <div class="med_content" v-else>
              <h2>{{ getPillById(2).name }}</h2>
              <p>Next Dose Time: {{ nextReminder_2 }}</p>
              <p>Dose Amount: {{ getPillById(2).doseAmount }}</p>
              <p>Remaining Quantity: {{ RemainWeight2 }}</p>
              <p>Last taken time: {{ lastTimeTaken2 }}</p>
            </div>
            <!-- Update -->
            <el-dropdown split-button type="primary" @click="preOrNew(2)">
              Update
              <template #dropdown>
                <el-dropdown-menu>
                  <!-- menu option：check history -->
                  <el-dropdown-item @click="showHistory2 = true">
                    View Medication History
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>

      <!-- popup window -->
      <el-dialog
        v-model="showHistory"
        title="Historical record of remaining medication quantity"
        width="50%"
        center
      >
        <div class="chart-container">
          <div
            id="myChart"
            ref="myChart"
            style="width: 600px; height: 400px"
          ></div>
        </div>
        <template #footer>
          <el-button @click="showHistory = false">Close</el-button>
        </template>
      </el-dialog>

      <!-- popup window2 -->
      <el-dialog
        v-model="showHistory2"
        title="Historical record of remaining medication quantity"
        width="50%"
        center
      >
        <div class="chart-container">
          <div
            id="myChart2"
            ref="myChart2"
            style="width: 600px; height: 400px"
          ></div>
        </div>
        <template #footer>
          <el-button @click="showHistory2 = false">Close</el-button>
        </template>
      </el-dialog>

      <div class="modal" v-if="showModal">
        <div class="modal-content">
          <h2>
            Are you looking to update the information of the current medication
            or switch to a new one?
          </h2>
          <div class="modal-buttons">
            <button
              :class="{ selected: selectedOption === 'update' }"
              @click="
                previousPill = true;
                this.selectedOption = 'update';
              "
            >
              Update Current Medication
            </button>
            <button
              :class="{ selected: selectedOption === 'switch' }"
              @click="
                previousPill = false;
                this.selectedOption = 'switch';
              "
            >
              Add a New Medication
            </button>
          </div>
          <button :disabled="selectedOption === null" @click="openModal">
            Confirm
          </button>
          <button
            @click="
              showModal = false;
              resetSelection();
            "
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- Medication Information popup window -->
      <div class="modal" v-if="isModalOpen">
        <div class="modal-content">
          <h2>Update</h2>
          <form @submit.prevent="submitMedicationForm">
            <div class="form-group" v-if="!previousPill">
              <label for="med_name">Medicine name</label>
              <input
                type="text"
                v-model="tempMedicationForm.name"
                id="medName"
                name="medName"
                required
              />
            </div>
            <div class="form-group" v-if="!previousPill">
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
              <p>Dosage Time</p>

              <!-- time selector -->
              <el-time-picker
                v-model="selectedTime"
                placeholder="Select time"
                format="HH:mm:ss"
                value-format="HH:mm:ss"
                :picker-options="{
                  selectableRange: '00:00:00 - 23:59:59',
                }"
              />

              <!-- time select button -->
              <button @click="addTime" :disabled="!selectedTime">
                Add Time
              </button>

              <!-- show time -->
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
  </div>
</template>

<script>
import axios from "axios";
import { ElMessage } from "element-plus";
import * as echarts from "echarts";
// import MyChart from "./components/MyChart.vue";

export default {
  // components: {
  //   MyChart,
  // },
  data() {
    return {
      maxTemp: null,
      //LastTimeTaken
      lastTimeTaken1: null,
      lastTimeTaken2: null,
      //Store objects of pill1 and 2
      dataRecords1: {
        lastTimeTaken: [],
        RemainQuantity: [],
      },
      dataRecords2: {
        lastTimeTaken: [],
        RemainQuantity: [],
      },
      trigger: 0,

      //Control drawer
      showHistory: false,
      showHistory2: false,

      drawer: false,
      loading: false, // control button load status
      value: 27,
      showModal: false,
      // select or not
      selectedOption: null,
      previousPill: null,
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
      selectedTime: null, // current time
      times: [], // store all times

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
        singleWeight: "",
      },

      pillWeight: [0, 0],
      pillWeight_t: [0, 1],
      RemainWeight1: null,
      RemainWeight2: null,
    };
  },
  mounted() {
    // this.updateChart();
    // this.initChart();
    this.fetchPills();
    this.fetchTemperature();

    this.fetchCurrentWeight();
    this.fetchMaxTemperature();

    setInterval(this.fetchCurrentWeight, 5000);
    setInterval(this.fetchTemperature, 5000);
    setInterval(this.fetchLastTakenTime, 5000);
  },
  watch: {
    lastTimeTaken1: {
      handler() {
        this.fetchCurrentWeight();
        setTimeout(() => {
          this.updateData(1);
          console.log(this.dataRecords1);
        }, 2000);
      },
    },
    lastTimeTaken2: {
      handler() {
        this.fetchCurrentWeight();
        setTimeout(() => {
          this.updateData(2);
          console.log(this.dataRecords2);
        }, 2000);
      },
    },
    trigger: {
      handler() {
        console.log("Success!");
      },
    },
    showHistory(newValue) {
      if (newValue) {
        this.updateChart();
      }
    },
    showHistory2(newValue) {
      if (newValue) {
        this.updateChart2();
      }
    },
  },
  methods: {
    updateChart() {
      this.$nextTick(() => {
        // Ensure that the DOM element is available
        if (!document.getElementById("myChart")) {
          console.error("Chart DOM element not found");
          return;
        }
        const chartContainer = document.getElementById("myChart");
        const chart = echarts.init(chartContainer);

        const options = {
          tooltip: {},
          legend: {},
          xAxis: {
            data: this.dataRecords1.lastTimeTaken,
          },
          yAxis: {},
          series: [
            {
              name: "Remaining Quantity",
              type: "line",
              data: this.dataRecords1.RemainQuantity,
            },
          ],
        };
        console.log("is true");
        chart.setOption(options);
      });
    },
    updateChart2() {
      this.$nextTick(() => {
        // Ensure that the DOM element is available
        if (!document.getElementById("myChart2")) {
          console.error("Chart DOM element not found");
          return;
        }
        const chartContainer = document.getElementById("myChart2");
        const chart = echarts.init(chartContainer);

        const options = {
          tooltip: {},
          legend: {},
          xAxis: {
            data: this.dataRecords2.lastTimeTaken,
          },
          yAxis: {},
          series: [
            {
              name: "Remaining Quantity",
              type: "line",
              data: this.dataRecords2.RemainQuantity,
            },
          ],
        };
        console.log("is true");
        chart.setOption(options);
      });
    },
    updateData(i) {
      if (i == 1) {
        this.dataRecords1.lastTimeTaken.push(this.lastTimeTaken1);
        this.dataRecords1.RemainQuantity.push(this.RemainWeight1);

        if (this.dataRecords1.lastTimeTaken.length > 6) {
          this.dataRecords1.lastTimeTaken.shift();
          this.dataRecords1.RemainQuantity.shift();
        }
      } else {
        this.dataRecords2.lastTimeTaken.push(this.lastTimeTaken2);
        this.dataRecords2.RemainQuantity.push(this.RemainWeight2);

        if (this.dataRecords2.lastTimeTaken.length > 6) {
          this.dataRecords2.lastTimeTaken.shift();
          this.dataRecords2.RemainQuantity.shift();
        }
      }
      console.log(this.dataRecords1);
      this.trigger++;
      console.log(this.trigger);
    },
    submitValue() {
      this.loading = true;

      axios
        .post("/updateMaxTemperature", {
          maxTemperature: this.value,
        })
        .then(() => {
          ElMessage({
            message: "Value submitted successfully!",
            type: "success",
          });
          this.drawer = false;
          this.fetchMaxTemperature();
        })
        .catch(() => {
          ElMessage({
            message: "Failed to submit the value",
            type: "error",
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },

    fetchCurrentWeight() {
      axios
        .get("/getCurrentWeight")
        .then((response) => {
          const weights = response.data;

          if (this.pills.length === weights.length) {
            this.pills.forEach((pill, index) => {
              pill.weight = weights[index];
            });
            this.calculateRemainingWeight();
          } else {
            console.error("Pills array and weights array length mismatch");
          }
        })
        .catch((error) => {
          console.error("Error fetching current weight:", error);
        });
    },

    fetchLastTakenTime() {
      axios
        .get("/getLastTimeTaken")
        .then((response) => {
          const lastTimeTaken = response.data;
          this.lastTimeTaken1 = lastTimeTaken[0];
          this.lastTimeTaken2 = lastTimeTaken[1];
        })
        .catch((error) => {
          console.error("Error fetching lastTimeTaken:", error);
        });
    },
    fetchTemperature() {
      axios
        .get("/tempServlet")
        .then((response) => {
          // Directly retrieve data from response.data, axios automatically parses JSON
          this.temperature = response.data;
        })
        .catch((error) => {
          // Handle request errors
          console.error("Error fetching temperature:", error);
        });
    },
    fetchMaxTemperature() {
      axios
        .get("/queryMaxtemp")
        .then((response) => {
          this.maxTemp = response.data;
        })
        .catch((error) => {
          // Handle request errors
          console.error("Error fetching temperature:", error);
        });
    },
    addTime() {
      if (this.selectedTime) {
        if (!this.tempMedicationForm.doseTimes.includes(this.selectedTime)) {
          this.tempMedicationForm.doseTimes.push(this.selectedTime);
        }
        this.selectedTime = null;
      }
    },
    fetchPills() {
      axios
        .get("/getPills")
        .then((response) => {
          this.pills = response.data; // Store the returned Pill array into pills

          this.pills.forEach((pill) => {
            if (typeof pill.doseTimes === "string") {
              pill.doseTimes = JSON.parse(pill.doseTimes);
            }
          });

          this.calculateNextReminder(); // After fetching data, calculate the next reminder time for each medication
        })
        .catch((error) => {
          console.error("Error fetching pills:", error);
        });
    },
    calculateRemainingWeight() {
      const pill1 = this.getPillById(1);
      const pill2 = this.getPillById(2);

      if (pill1 && pill1.weight > 0 && pill1.singleWeight > 0) {
        this.RemainWeight1 = Math.round(pill1.weight / pill1.singleWeight);
      } else {
        this.RemainWeight1 = 0;
      }

      if (pill2 && pill2.weight > 0 && pill2.singleWeight > 0) {
        this.RemainWeight2 = Math.round(pill2.weight / pill2.singleWeight);
      } else {
        this.RemainWeight2 = 0;
      }
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
    preOrNew(medicationId) {
      this.tempMedicationForm.id = medicationId;
      this.showModal = true;
    },
    // Open the medication information modal and initialize form data
    openModal() {
      if (this.selectedOption === null) {
        alert("Please select an option before confirming!");
      } else if (this.selectedOption === "update") {
        this.showModal = false;
        const pill = this.getPillById(this.tempMedicationForm.id);
        this.tempMedicationForm.name = pill.name;
        this.tempMedicationForm.quantity = pill.initialQuantity;
        this.tempMedicationForm.singleWeight = this.calculatePillWeight(
          pill.id
        );
        this.tempMedicationForm.doseAmount = "";
        this.tempMedicationForm.doseTimes = [];
        this.isModalOpen = true;
      } else {
        this.showModal = false;
        this.tempMedicationForm.name = "";
        this.tempMedicationForm.quantity = "";
        this.tempMedicationForm.singleWeight = 0;
        this.tempMedicationForm.doseAmount = "";
        this.tempMedicationForm.doseTimes = [];
        this.isModalOpen = true;
        if (this.tempMedicationForm.id == 1) {
          this.lastTimeTaken1 = null;
        } else {
          this.lastTimeTaken2 = null;
        }
      }
    },
    // Close the medication information modal
    closeModal() {
      this.isModalOpen = false;
      this.resetSelection();
    },
    resetSelection() {
      this.selectedOption = null;
      this.previousPill = null;
    },
    // Submit the medication information form
    submitMedicationForm() {
      console.log("lastTaken1 : " + this.lastTimeTaken1);
      // Assume the form data is packaged into a medication object pill
      const pill = {
        id: this.tempMedicationForm.id,
        name: this.tempMedicationForm.name,
        initialQuantity: this.tempMedicationForm.quantity,
        doseTimes: JSON.stringify(this.tempMedicationForm.doseTimes), // Selected times
        doseAmount: this.tempMedicationForm.doseAmount,
        singleWeight:
          this.tempMedicationForm.singleWeight ||
          this.calculatePillWeight(this.tempMedicationForm.id),
        lastTimeTaken:
          this.tempMedicationForm.id == 1
            ? this.lastTimeTaken1
            : this.lastTimeTaken2,
      };

      // Call the backend API to send the pill object data
      axios
        .post("/updatePill", pill, {
          headers: {
            "Content-Type": "application/json",
          },
        })
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
    calculatePillWeight(id) {
      const pill = this.getPillById(id);

      if (!this.previousPill) {
        if (this.tempMedicationForm.quantity > 0 && pill.weight > 0) {
          return pill.weight / this.tempMedicationForm.quantity;
        } else {
          console.error("Quantity or weight is invalid");
          return 0;
        }
      } else {
        return pill.singleWeight || 0;
      }
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
