<template>
  <v-flex xs4>
    <v-card class="mx-auto" max-width="400">
      <v-card flat>
        <v-btn absolute bottom color="red darken-1" right fab @click="remove()">
          <v-icon>delete</v-icon>
        </v-btn>
        <v-card-title>
          <v-select
            :items="users"
            placeholder="Select Attendee Name"
            solo
          ></v-select>
        </v-card-title>
      </v-card>
      <v-card-text class="py-0">
        <v-timeline align-top dense>
          <v-timeline-item color="teal lighten-3" small>
            <v-layout pt-3>
              <v-flex xs3>
                <strong>12-1pm</strong>
              </v-flex>
              <v-flex>
                <strong>Lectures</strong>
                <div class="caption">Mobile App</div>
              </v-flex>
            </v-layout>
          </v-timeline-item>

          <v-timeline-item color="teal lighten-3" small>
            <v-layout wrap pt-3>
              <v-flex xs3>
                <strong>3-4pm</strong>
              </v-flex>
              <v-flex>
                <strong>Design Stand Up</strong>
                <div class="caption mb-2">Hangouts</div>
                <v-avatar>
                  <v-img
                    src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairFrida&accessoriesType=Kurt&hairColor=Red&facialHairType=BeardLight&facialHairColor=BrownDark&clotheType=GraphicShirt&clotheColor=Gray01&graphicType=Skull&eyeType=Wink&eyebrowType=RaisedExcitedNatural&mouthType=Disbelief&skinColor=Brown"
                  ></v-img>
                </v-avatar>
                <v-avatar>
                  <v-img
                    src="https://avataaars.io/?avatarStyle=Circle&topType=ShortHairFrizzle&accessoriesType=Prescription02&hairColor=Black&facialHairType=MoustacheMagnum&facialHairColor=BrownDark&clotheType=BlazerSweater&clotheColor=Black&eyeType=Default&eyebrowType=FlatNatural&mouthType=Default&skinColor=Tanned"
                  ></v-img>
                </v-avatar>
                <v-avatar>
                  <v-img
                    src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairMiaWallace&accessoriesType=Sunglasses&hairColor=BlondeGolden&facialHairType=Blank&clotheType=BlazerSweater&eyeType=Surprised&eyebrowType=RaisedExcited&mouthType=Smile&skinColor=Pale"
                  ></v-img>
                </v-avatar>
              </v-flex>
            </v-layout>
          </v-timeline-item>

          <v-timeline-item color="teal lighten-3" small>
            <v-layout pt-3>
              <v-flex xs3>
                <strong>12pm</strong>
              </v-flex>
              <v-flex>
                <strong>Lunch break</strong>
              </v-flex>
            </v-layout>
          </v-timeline-item>

          <v-timeline-item color="teal lighten-3" small>
            <v-layout pt-3>
              <v-flex xs3>
                <strong>9-11pm</strong>
              </v-flex>
              <v-flex>
                <strong>Home Work</strong>
                <div class="caption">Web App</div>
              </v-flex>
            </v-layout>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>
    </v-card>
  </v-flex>
</template>
<script>
export default {
  props: ["id"],
  data() {
    return {
      users: ["Ronny", "Pam", "Mike"]
    };
  },
  methods: {
    remove() {
      this.$emit("remove", this.id);
    }
  }
};
</script>

<style lang="scss" scoped></style>
