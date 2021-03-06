<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col>
        <v-data-table
          :loading="isLoading"
          :headers="headers"
          :items="merge"
          :sort-by="['operatingStartDate']"
          :sort-desc="[true]"
          group-by="OrganizationID"
          :items-per-page="5"
          multi-sort
          :single-expand="singleExpand"
          :expanded.sync="expanded"
          item-key="ProjectID"
          show-expand
          class="elevation-1"
          show-group-by
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Projects</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-dialog
                v-model="dialog"
                fullscreen
                hide-overlay
                transition="dialog-bottom-transition"
              >
                <template v-slot:activator="{ on }">
                  <v-btn dark small color="pink" fab v-on="on">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-toolbar dark color="primary">
                    <v-btn icon dark @click="dialog = false">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                      <v-btn dark text @click="save">Save</v-btn>
                    </v-toolbar-items>
                  </v-toolbar>
                  <v-card-text>
                    <v-container style="max-width:1080px;">
                      <v-row no-gutters>
                        <v-col cols="12">
                          <v-select
                            v-model="editedItem.OrganizationID"
                            :items="organizationSelect"
                            :value="organizationSelect.OrganizationID"
                            label="Organization"
                            outlined
                          ></v-select>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="editedItem.ProjectName"
                            label="Project name"
                            outlined
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="editedItem.ProjectCommonName"
                            label="Project Common Name"
                            outlined
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-menu
                            v-model="menu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-model="editedItem.OperatingStartDate"
                                label="Project Start Date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-on="on"
                                outlined
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="editedItem.OperatingStartDate"
                              @input="menu = false"
                              scrollable
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-menu
                            v-model="menu2"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                :value="editedItem.OperatingEndDate"
                                label="Project End Date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-on="on"
                                outlined
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="editedItem.OperatingEndDate"
                              @input="menu2 = false"
                              scrollable
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12">
                          <v-select
                            v-model="editedItem.ContinuumProject"
                            :items="noYes"
                            :value="noYes.value"
                            label="Continuum Project"
                            outlined
                          ></v-select>
                        </v-col>
                        <v-col cols="12">
                          <v-autocomplete
                            v-model="editedItem.ProjectType"
                            :items="projectType"
                            :value="projectType.value"
                            label="Project Type"
                            outlined
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12">
                          <v-autocomplete
                            v-model="editedItem.HousingType"
                            :items="housingType"
                            :value="housingType.value"
                            label="Housing Type"
                            outlined
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12">
                          <v-select
                            v-model="editedItem.ResidentialAffiliation"
                            :items="noYes"
                            :value="noYes.value"
                            label="Residential Affiliation"
                            outlined
                          ></v-select>
                        </v-col>
                        <v-col cols="12">
                          <v-autocomplete
                            v-model="editedItem.TrackingMethod"
                            :items="trackingMethod"
                            :value="trackingMethod.value"
                            label="Tracking Method"
                            outlined
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12">
                          <v-select
                            v-model="editedItem.HMISParticipatingProject"
                            :items="noYes"
                            :value="noYes.value"
                            label="HMIS Participating Project"
                            outlined
                          ></v-select>
                        </v-col>
                        <v-col cols="12">
                          <v-autocomplete
                            v-model="editedItem.TargetPopulation"
                            :items="targetPopulation"
                            :value="targetPopulation.value"
                            label="Target Population"
                            outlined
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="editedItem.PITCount"
                            label="PIT Count"
                            outlined
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close"
                      >Cancel</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template
            v-slot:group.header="{ items, isOpen, toggle, remove, groupBy }"
          >
            <th :colspan="headers.length">
              <v-row align="center">
                <v-col>
                  <v-icon @click="toggle"
                    >{{ isOpen ? "mdi-minus" : "mdi-plus" }}
                  </v-icon>
                  <span v-if="groupBy == 'ProjectType'" class="px-1">
                    {{ items[0].ProjectType | toText(projectType) }}
                  </span>
                  <span v-if="groupBy == 'OrganizationID'" class="px-1">
                    {{ items[0].OrganizationID | toText(organizationSelect) }}
                  </span>
                  <span v-if="groupBy == 'OperatingStartDate'" class="px-1">
                    {{ items[0].OperatingStartDate }}
                  </span>
                  <span v-if="groupBy == 'OperatingEndDate'" class="px-1">
                    {{ items[0].OperatingEndDate }}
                  </span>
                  <span
                    v-if="groupBy == 'HMISParticipatingProject'"
                    class="px-1"
                  >
                    {{ items[0].HMISParticipatingProject | toText(noYes) }}
                  </span>
                  <span v-if="groupBy == 'ContinuumProject'" class="px-1">
                    {{ items[0].ContinuumProject | toText(noYes) }}
                  </span>
                  <v-icon @click="remove">{{ "mdi-close" }} </v-icon>
                </v-col>
              </v-row>
            </th>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Reset</v-btn>
          </template>
          <template v-slot:item.ProjectName="{ item }">
            {{ item.ProjectName }}
          </template>
          <template v-slot:item.ProjectType="{ item }">
            {{ item.ProjectType | toText(projectType) }}
          </template>
          <template v-slot:item.OrganizationID="{ item }">
            {{ item.OrganizationID | toText(organizationSelect) }}
          </template>
          <template v-slot:item.DateCreated="{ item }">
            {{ item.DateCreated | dateFilter }}
          </template>
          <template v-slot:item.DateUpdated="{ item }">
            {{ item.DateUpdated | dateFilter }}
          </template>
          <template v-slot:item.HMISParticipatingProject="{ item }">
            {{ item.HMISParticipatingProject | toText(noYes) }}
          </template>
          <template v-slot:item.ContinuumProject="{ item }">
            {{ item.ContinuumProject | toText(noYes) }}
          </template>
          <template v-slot:item.AmountTotal="{ item }">
            {{ item.AmountTotal | currency }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Reset</v-btn>
          </template>
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length" class="ma-0 pa-2">
              <v-lazy
                :options="{
                  threshold: 0.5
                }"
                min-height="150"
                transition="fade-transition"
              >
                <v-container>
                  <v-row no-gutters>
                    <v-col cols="12" md="4">
                      <v-row no-gutters>
                        <v-col cols="12">
                          <div>
                            <b>Project Common Name:</b>
                            {{ item.ProjectCommonName }}
                          </div>
                          <div><b>Project ID:</b> {{ item.ProjectID }}</div>
                          <div>
                            <b>Organization ID:</b> {{ item.OrganizationID }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-row no-gutters>
                        <v-col cols="12">
                          <div>
                            <b>Residential Affiliation:</b>
                            {{ item.ResidentialAffiliation | toText(noYes) }}
                          </div>

                          <div>
                            <b>Tracking Method:</b>
                            {{ item.TrackingMethod | toText(trackingMethod) }}
                          </div>

                          <div>
                            <b>Target Population:</b>
                            {{
                              item.TargetPopulation | toText(targetPopulation)
                            }}
                          </div>

                          <div><b>PIT Count:</b> {{ item.PITCount }}</div>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-row no-gutters>
                        <v-col cols="12">
                          <div><b>User ID:</b> {{ item.UserID }}</div>
                          <div>
                            <b>Date Created:</b>
                            {{ item.DateCreated | dateFilter }}
                          </div>

                          <div>
                            <b>Date Updated:</b>
                            {{ item.DateUpdated | dateFilter }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-data-table
                        :headers="subDataHeaders"
                        :items="item.subData"
                        item-key="FunderID"
                        :items-per-page="5"
                        hide-default-footer
                        class="test elevation-2"
                        dense
                      >
                        <template v-slot:item.Tooltip="{ item }">
                          <v-tooltip
                            top
                            v-if="
                              item.StartDate >
                                new Date().toISOString().substr(0, 10)
                            "
                          >
                            <template v-slot:activator="{ on }">
                              <v-btn icon v-on="on">
                                <v-icon>mdi-alert-circle</v-icon>
                              </v-btn>
                            </template>
                            <span>Future Funder</span>
                          </v-tooltip>
                        </template>
                        <template v-slot:item.Funder="{ item }">
                          {{ item.Funder | toText(fundingSource) }}
                        </template>
                        <template v-slot:item.Amount="{ item }">
                          {{ item.Amount | currency }}
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                </v-container>
              </v-lazy>
            </td>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import UserStore from "@/store/user/user-store";
import { db, Timestamp } from "@/firebase";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
// lists
import ProjectType from "@/util/constants/admin/projects/project-type";
import HousingType from "@/util/constants/admin/projects/housing-type";
import NoYes from "@/util/constants/admin/no-yes";
import TargetPopulation from "@/util/constants/admin/projects/target-population";
import TrackingMethod from "@/util/constants/admin/projects/tracking-method";
import FundingSource from "@/util/constants/admin/funding/funding-source";
// Merge
import Merge from "@/util/constants/admin/merge";

export default Vue.extend({
  data: () => ({
    //// TODO:
    projectType: ProjectType,
    housingType: HousingType,
    targetPopulation: TargetPopulation,
    trackingMethod: TrackingMethod,
    fundingSource: FundingSource,
    noYes: NoYes,
    // Firestore collection
    collection: db.collection("Project"),
    organizationSelect: [{}],
    funder: [{}],
    result: [{}],
    // Datepicker
    menu: false,
    menu2: false,
    // Data Table
    isLoading: false,
    dialog: false,
    expanded: [],
    singleExpand: true,
    headers: [
      {
        text: "Project Name",
        align: "start",
        sortable: true,
        value: "ProjectName"
      },
      {
        text: "Project Type",
        sortable: true,
        value: "ProjectType"
      },
      {
        text: "Organization Name",
        sortable: true,
        value: "OrganizationID"
      },
      {
        text: "Operating Start Date",
        sortable: true,
        value: "OperatingStartDate"
      },
      {
        text: "Operating End Date",
        sortable: true,
        value: "OperatingEndDate"
      },
      {
        text: "Continuum Project",
        align: "center",
        sortable: true,
        value: "ContinuumProject"
      },
      {
        text: "HMIS Participating Project",
        align: "center",
        sortable: true,
        value: "HMISParticipatingProject"
      },
      {
        text: "Amount Total",
        sortable: true,
        value: "AmountTotal"
      },

      { text: "Actions", value: "actions", align: "center", sortable: false }
    ],
    subDataHeaders: [
      {
        text: "Notice",
        align: "start",
        sortable: false,
        value: "Tooltip"
      },
      {
        text: "Funder",
        sortable: true,
        value: "Funder"
      },
      {
        text: "Grant ID",
        sortable: true,
        value: "GrantID"
      },
      {
        text: "Start Date",
        sortable: true,
        value: "StartDate"
      },
      {
        text: "End Date",
        sortable: true,
        value: "EndDate"
      },
      {
        text: "Amount",
        sortable: true,
        value: "Amount"
      }
    ],
    data: [{}],
    editedIndex: -1,
    editedItem: {
      // HMIS
      ProjectID: "",
      OrganizationID: "",
      ProjectName: "",
      ProjectCommonName: "",
      OperatingStartDate: new Date().toISOString().substr(0, 10),
      OperatingEndDate: new Date().toISOString().substr(0, 10),
      ContinuumProject: 0,
      ProjectType: 0,
      HousingType: 0,
      ResidentialAffiliation: 0,
      TrackingMethod: 0,
      HMISParticipatingProject: 0,
      TargetPopulation: 0,
      PITCount: 0,
      DateCreated: new Date(),
      DateUpdated: new Date(),
      UserID: ""
      // Custom
    },
    defaultItem: {
      // HMIS
      ProjectID: "",
      OrganizationID: "",
      ProjectName: "",
      ProjectCommonName: "",
      OperatingStartDate: new Date().toISOString().substr(0, 10),
      OperatingEndDate: new Date().toISOString().substr(0, 10),
      ContinuumProject: 0,
      ProjectType: 0,
      HousingType: 0,
      ResidentialAffiliation: 0,
      TrackingMethod: 0,
      HMISParticipatingProject: 0,
      TargetPopulation: 0,
      PITCount: 0,
      DateCreated: new Date(),
      DateUpdated: new Date(),
      UserID: ""
      // Custom
    }
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Project" : "Edit Project";
    },
    selectYear(): number[] {
      const range = (a: number, b: number) =>
        Array.from(new Array(b > a ? b - a : a - b), (x, i) =>
          b > a ? i + a : a - i
        );
      const currentYear = new Date().getFullYear();
      return range(currentYear, currentYear - 5);
    },
    userId(): string {
      return UserStore.user.id;
    },
    merge() {
      return Merge.byKey(this.data, this.funder, "ProjectID");
    }
  },
  filters: {
    dateFilter: function(value: any) {
      return value ? format(value, "yyyy-MM-dd' at 'HH:mm:ss a") : "";
    },
    //https://stackoverflow.com/questions/42828664/access-vue-instance-data-inside-filter-method
    toText: function(item: number, variable: Array<any>) {
      const idArr = [item];

      const idValueMap: any = variable.reduce(
        (acc, { value, text }) => ({ ...acc, [value]: text }),
        {}
      );
      const output = idArr.map(value => idValueMap[value]);
      return output.toString();
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  created() {
    this.initialize();
    this.fetchOrganization();
  },
  methods: {
    fetchOrganization() {
      db.collection("Organization")
        .get()
        .then(snapshot => {
          this.organizationSelect = [];
          snapshot.forEach(doc => {
            this.organizationSelect.push({
              value: doc.data().OrganizationID,
              text: doc.data().OrganizationName
            });
          });
        })
        .catch(err => {
          console.log("Error getting documents", err);
        });
    },
    initialize() {
      this.isLoading = true;
      this.collection.onSnapshot(querySnapshot => {
        this.data = [];
        querySnapshot.forEach(doc => {
          this.data.push({
            //
            ProjectID: doc.id,
            OrganizationID: doc.data().OrganizationID,
            ProjectName: doc.data().ProjectName,
            ProjectCommonName: doc.data().ProjectCommonName,
            OperatingStartDate: format(
              doc.data().OperatingStartDate.toDate(),
              "yyyy-MM-dd"
            ),
            OperatingEndDate: format(
              doc.data().OperatingEndDate.toDate(),
              "yyyy-MM-dd"
            ),
            ContinuumProject: doc.data().ContinuumProject,
            ProjectType: doc.data().ProjectType,
            HousingType: doc.data().HousingType,
            ResidentialAffiliation: doc.data().ResidentialAffiliation,
            TrackingMethod: doc.data().TrackingMethod,
            HMISParticipatingProject: doc.data().HMISParticipatingProject,
            TargetPopulation: doc.data().TargetPopulation,
            PITCount: doc.data().PITCount,
            DateCreated: doc.data().DateCreated.toDate(),
            DateUpdated: doc.data().DateUpdated.toDate(),
            UserID: doc.data().UserID
            // Custom
          });
        });
      });
      db.collection("Funder")
        .where("EndDate", ">=", new Date())
        .get()
        .then(snapshot => {
          this.funder = [];
          snapshot.forEach(doc => {
            this.funder.push({
              //
              FunderID: doc.id,
              Funder: doc.data().Funder,
              ProjectID: doc.data().ProjectID,
              GrantID: doc.data().GrantID,
              Amount: doc.data().Amount,
              StartDate: format(doc.data().StartDate.toDate(), "yyyy-MM-dd"),
              EndDate: format(doc.data().EndDate.toDate(), "yyyy-MM-dd")
            });
          });
          this.isLoading = false;
        })
        .catch(err => {
          console.log("Error getting documents", err);
        });
    },
    editItem(item: any) {
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item: any) {
      const index: any = this.data.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.collection.doc(item.ProjectID).delete();
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    save() {
      const timestamp = Timestamp.fromDate(new Date());
      const firestoreData = {
        //
        OrganizationID: this.editedItem.OrganizationID,
        ProjectName: this.editedItem.ProjectName,
        ProjectCommonName: this.editedItem.ProjectCommonName,
        OperatingStartDate: parseISO(this.editedItem.OperatingStartDate),
        OperatingEndDate: parseISO(this.editedItem.OperatingEndDate),
        ContinuumProject: this.editedItem.ContinuumProject,
        ProjectType: this.editedItem.ProjectType,
        HousingType: this.editedItem.HousingType,
        ResidentialAffiliation: this.editedItem.ResidentialAffiliation,
        TrackingMethod: this.editedItem.TrackingMethod,
        HMISParticipatingProject: this.editedItem.HMISParticipatingProject,
        TargetPopulation: this.editedItem.TargetPopulation,
        PITCount: this.editedItem.PITCount,
        DateUpdated: timestamp,
        UserID: this.userId

        //
      };
      if (this.editedIndex > -1) {
        this.collection
          .doc(this.editedItem.ProjectID)
          .update({
            ...firestoreData
          })
          .catch(e => {
            console.log(e);
          });
      } else {
        this.collection
          .add({
            ...firestoreData,
            DateCreated: timestamp
          })
          .then(docRef => {
            this.collection.doc(docRef.id).update({ ProjectID: docRef.id });
          })
          .catch(e => {
            console.log(e);
          });
      }
      this.close();
    }
  }
});
</script>
<style scoped>
.test .theme--light.v-table {
  background-color: #00f;
}
</style>
