<template lang="html">
  <div class="container">
    <div class="animated" v-if="profileFilters[0].isActive">
      <div class="">
        <div class="box" @click="updateEmail()">
          <p class="sign_special">@</p>
        </div>
        <p class="dayname">Email</p>
        <div class="ingredients_break">

        </div>
        <div class="">
          <label for="">New Email</label>
          <input class="amount" type="text" name="" value="" v-model="userEmail" @keyup.enter="updateEmail()">
          <br>
        </div>
      </div>
      <div class="">
        <div class="box" @click="updatePassword()">
          <p class="sign_special">#</p>
        </div>
        <p class="dayname">Password</p>
        <div class="ingredients_break">

        </div>
        <div class="">
          <form class="" action="" method="post">
            <label for="">Old Password</label>
            <!-- Email input field required for accessibility reasons -->
            <input type="text" name="email" value="..." autocomplete="username email" style="display: none;">
            <input class="amount" type="password" name="" value="" v-model="oldPassword" autocomplete="current-password" required>
          </form>
          <br>
        </div>
        <div class="">
          <form class="" action="" method="post">
            <label for="">New Password</label>
            <!-- Email input field required for accessibility reasons -->
            <input type="text" name="email" value="..." autocomplete="username email" style="display: none;">
            <input class="amount" type="password" name="" value="" v-model="newPassword" autocomplete="new-password" required>
          </form>
          <br>
        </div>
        <div class="">
          <form class="" action="" method="post">
            <label for="">Confirm Password</label>
            <!-- Email input field required for accessibility reasons -->
            <input type="text" name="email" value="..." autocomplete="username email" style="display: none;">
            <input class="amount" type="password" name="" value="" v-model="checkPassword" @keyup.enter="updatePassword()" autocomplete="new-password" required>
          </form>
          <br>
        </div>
      </div>
      <div class="">
        <div class="box" @click="deleteAccount()">
          <p class="sign" style="transform: rotate(45deg)">+</p>
        </div>
        <p class="dayname">Delete Account</p>
        <div class="ingredients_break">

        </div>
        <div class="">
          <label for="">Enter YES</label>
          <input class="amount" type="text" name="" value="" v-model="deleteConfirmation" @keyup.enter="deleteAccount()" required>
          <br>
        </div>
      </div>

      <!-- Adds days for the month ahead to the currently signed in user, also default if not signed in. -->
      <div v-if="this.userID == '0E2NXBmuwZhr0r0CuKCZT1N27CE3'" class="">
        <div class="box">
          <p class="sign">+</p>
        </div>
        <p class="dayname">Add Months to Default</p>
        <div class="ingredients_break">

        </div>
        <div class="" style="margin-bottom: 35px">
          <div class="year_date">
            <p>{{ currentYear }}</p>
          </div>
          <div class="">
            <div class="block_date">
              <template v-for="month in listMonthsDefault.slice(0,4)">
                <!-- eslint-disable-next-line -->
                <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased }" class="inline_date" @click="toggleSelected(month)">{{ month.month.format('MMM') }}</p>
              </template>
            </div>
            <div class="block_date">
              <template v-for="month in listMonthsDefault.slice(4,8)">
                <!-- eslint-disable-next-line -->
                <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased }" class="inline_date" @click="toggleSelected(month)">{{ month.month.format('MMM') }}</p>
              </template>
            </div>
            <div class="block_date">
              <template v-for="month in listMonthsDefault.slice(8,12)">
                <!-- eslint-disable-next-line -->
                <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased }" class="inline_date" @click="toggleSelected(month)">{{ month.month.format('MMM') }}</p>
              </template>
            </div>
          </div>
        </div>
        <div class="">
          <div class="year_date">
            <p>{{ Number(currentYear) + 1 }}</p>
          </div>
          <div class="">
            <div class="block_date">
              <template v-for="month in listMonthsDefault.slice(12,16)">
                <!-- eslint-disable-next-line -->
                <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased }" class="inline_date" @click="toggleSelected(month)">{{ month.month.format('MMM') }}</p>
              </template>
            </div>
            <div class="block_date">
              <template v-for="month in listMonthsDefault.slice(16,20)">
                <!-- eslint-disable-next-line -->
                <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased }" class="inline_date" @click="toggleSelected(month)">{{ month.month.format('MMM') }}</p>
              </template>
            </div>
            <div class="block_date">
              <template v-for="month in listMonthsDefault.slice(20,24)">
                <!-- eslint-disable-next-line -->
                <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased }" class="inline_date" @click="toggleSelected(month)">{{ month.month.format('MMM') }}</p>
              </template>
            </div>
            <p class="year_date price">{{ price }} CHF</p>
            <div class="purchase_button" @click="addMonthsToDefault()">
              <span class="purchase_text">Add to Default</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Adds days for the month ahead to the currently signed in user, also default if not signed in. -->
      <div class="" style="margin-bottom: 100px">
        <div class="box">
          <p class="sign">+</p>
        </div>
        <p class="dayname">Add Months</p>
        <div class="ingredients_break">

        </div>
        <div class="" style="margin-bottom: 35px">
          <div class="year_date">
            <p>{{ currentYear }}</p>
          </div>
          <div class="">
            <div class="block_date">
              <template v-for="month in listMonths.slice(0,4)">
                <!-- eslint-disable-next-line -->
                <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased }" class="inline_date" @click="toggleSelected(month)">{{ month.month.format('MMM') }}</p>
              </template>
            </div>
            <div class="block_date">
              <template v-for="month in listMonths.slice(4,8)">
                <!-- eslint-disable-next-line -->
                <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased }" class="inline_date" @click="toggleSelected(month)">{{ month.month.format('MMM') }}</p>
              </template>
            </div>
            <div class="block_date">
              <template v-for="month in listMonths.slice(8,12)">
                <!-- eslint-disable-next-line -->
                <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased }" class="inline_date" @click="toggleSelected(month)">{{ month.month.format('MMM') }}</p>
              </template>
            </div>
          </div>
        </div>
        <div class="">
          <div class="year_date">
            <p>{{ Number(currentYear) + 1 }}</p>
          </div>
          <div class="">
            <div class="block_date">
              <template v-for="month in listMonths.slice(12,16)">
                <!-- eslint-disable-next-line -->
                <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased }" class="inline_date" @click="toggleSelected(month)">{{ month.month.format('MMM') }}</p>
              </template>
            </div>
            <div class="block_date">
              <template v-for="month in listMonths.slice(16,20)">
                <!-- eslint-disable-next-line -->
                <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased }" class="inline_date" @click="toggleSelected(month)">{{ month.month.format('MMM') }}</p>
              </template>
            </div>
            <div class="block_date">
              <template v-for="month in listMonths.slice(20,24)">
                <!-- eslint-disable-next-line -->
                <p :class="{ inline_date_selected: month.isActive, inline_date_bought: month.isPurchased }" class="inline_date" @click="toggleSelected(month)">{{ month.month.format('MMM') }}</p>
              </template>
            </div>
            <p class="year_date price">{{ price }} CHF</p>
            <div class="purchase_button" @click="addMonths()">
              <span class="purchase_text">Purchase Months</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="animated" v-if="profileFilters[1].isActive">
      <template v-for="(place, index) in userData.addresses">
        <!-- eslint-disable-next-line -->
        <div class="box" @click="deletePlace(place)">
          <p class="sign" style="transform: rotate(45deg)">+</p>
        </div>
        <!-- eslint-disable-next-line -->
        <p class="dayname"> {{ place.name }} </p>
        <!-- eslint-disable-next-line -->
        <div class="ingredients_break">

        </div>
        <!-- eslint-disable-next-line -->
        <div class="">
          <label for="">Edit Place</label>
          <input class="amount" type="text" name="" value="" v-model="place.name" @keyup.enter="removeFocus()" required>
          <br>
        </div>
        <!-- eslint-disable-next-line -->
        <div class="" v-if="checkOwner(index)">
          <template v-for="member in userAddresses[index].members">
            <!-- eslint-disable-next-line -->
              <div v-if="member.role != 'Owner'">
                <button @click="removeMember(member, index)">Remove</button>
              </div>
              <!-- eslint-disable-next-line -->
            <label>{{ member.role }}</label>
            <!-- eslint-disable-next-line -->
            <input class="amount" type="text" @keyup.enter="removeFocus()" v-model="member.email" required>
            <!-- eslint-disable-next-line -->
            <br>
          </template>
          <label for="">Add Member</label>
          <input class="amount" type="text" name="" value="" @keyup.enter="addMember(place)" v-model="newMember" required>
          <br>
        </div>
        <!-- eslint-disable-next-line -->
        <div class="" v-else>
          <template v-for="member in userAddresses[index].members">
            <!-- eslint-disable-next-line -->
            <label>{{ member.role }}</label>
            <!-- eslint-disable-next-line -->
            <input class="amount" type="text" @keyup.enter="removeFocus()" v-model="member.email" required>
            <!-- eslint-disable-next-line -->
            <br>
          </template>
        </div>
      </template>
      <div class="" style="margin-bottom: 200px">
        <div class="box" @click="addPlace">
          <p class="sign">+</p>
        </div>
        <p class="dayname">New Place</p>
        <div class="ingredients_break">

        </div>
        <div class="">
          <label for="dayname">New Place</label>
          <input class="amount" type="text" name="" value="" @keyup.enter="addPlace()" v-model="newPlace">
          <br>
        </div>
      </div>
    </div>
    <div class="animated" v-if="profileFilters[2].isActive">
      <template v-for="tag in userData.tagList">
        <!-- eslint-disable-next-line -->
        <div class="box" @click="deleteFilter(tag)">
          <p class="sign" style="transform: rotate(45deg)">+</p>
        </div>
        <!-- eslint-disable-next-line -->
        <p class="dayname"> {{ tag.text }} </p>
        <!-- eslint-disable-next-line -->
        <div class="ingredients_break">

        </div>
        <!-- eslint-disable-next-line -->
        <div class="">
          <label for="">Edit Filter</label>
          <input class="amount" type="text" name="" value="" @keyup.enter="removeFocus()" v-model="tag.text" required>
          <br>
        </div>
      </template>
      <div class="" style="margin-bottom: 200px">
        <div class="box">
          <p class="sign" @click="addFilter()">+</p>
        </div>
        <p class="dayname">New Filter</p>
        <div class="ingredients_break">

        </div>
        <div class="">
          <label for="">New Filter</label>
          <input class="amount" id="newFilter" type="text" name="" value="" @keyup.enter="addFilter()" v-model="newFilter" required>
        </div>
        <div class="purchase_button" @click="addFilter()" style="margin-top: 40px">
          <span class="purchase_text">Add Filter</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'
import db from '@/database.js'
import moment from 'moment'

export default {
  name: 'Profile',
  created () {
    this.$store.commit('setPage', 'profile')
  },
  data () {
    return {
      newFilter: '',
      newPlace: '',
      newMember: '',
      oldPassword: '',
      newPassword: '',
      checkPassword: '',
      deleteConfirmation: '',
      currentYear: moment().format('YYYY')
    }
  },
  computed: {
    ...mapState([
      'profileFilters',
      'userData',
      'defaultData',
      'userAddresses',
      'userEmail',
      'userID',
      'listMonths',
      'listMonthsDefault',
      'price'
    ]),
    userEmail: {
      get () {
        return this.$store.state.userEmail
      },
      set (value) {
        this.$store.commit('syncUserEmail', value)
      }
    }
  },
  methods: {
    ...mapMutations([
      'deleteFilter',
      'deletePlace',
      'toggleSelected',
      'addMonths',
      'addMonthsToDefault'
    ]),
    removeFocus () {
      const placesList = document.getElementsByClassName('editPlace')
      for (let p = 0; p < placesList.length; p++) {
        placesList[p].blur()
      }
    },
    checkOwner (index) {
      for (let role = 0; role < this.userAddresses[index].members.length; role++) {
        if (this.userAddresses[index].members[role].role === 'Owner' && this.userAddresses[index].members[role].uid === this.userID) {
          return true
        }
      }
    },
    addMember (place) {
      const collectionRef = db.collection('users')
      collectionRef.where('info.email', '==', this.newMember).get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            if (doc.exists) {
              const docRef = doc.id
              // Adds place to addresses array of new member.
              const localEmail = this.userEmail
              var memberData = ''
              db.collection('users').doc(docRef).get()
                .then(function (doc) {
                  if (doc.exists) {
                    memberData = doc.data()
                    // Adds the new place to addresses
                    memberData.addresses.push({
                      address: place.address,
                      isActive: false,
                      name: 'Invited by ' + localEmail
                    })
                    // Saves the new  data to the user's document.
                    db.collection('users').doc(docRef).set(memberData)
                      .then(function () {
                        console.log('Users document successfully written!')
                      })
                      .catch(function (error) {
                        console.error('Error writing document: ', error)
                      })
                  } else {
                    // doc.data() will be undefined in this case
                    console.log('No such document.')
                  }
                })
                .catch(function (error) {
                  console.log('Error getting document:', error)
                })
              // Adds new member to members array of address with role and uid.
              const localMember = this.newMember
              db.collection('addresses').doc(place.address).get()
                .then(function (doc) {
                  if (doc.exists) {
                    const addressData = doc.data()
                    console.log('Adding new data to members array.')
                    addressData.members.push({
                      email: localMember,
                      role: 'Member',
                      uid: memberData.info.uid
                    })
                    console.log('Saving new address document')
                    db.collection('addresses').doc(place.address).set(addressData)
                      .then(function () {
                        console.log('Addresses document successfully written!')
                      })
                      .catch(function (error) {
                        console.error('Error writing document: ', error)
                      })
                  } else {
                  // doc.data() will be undefined in this case
                    console.log('No such document.')
                  }
                })
                .catch(function (error) {
                  console.log('Error getting document:', error)
                })
              this.$store.commit('getData')
              this.newMember = ''
            }
          })
        })
        .catch(err => {
          console.log('Error getting documents', err)
        })
    },
    removeMember (member, index) {
      // Removes the address from the users addresses' array.
      const localUserAddresses = this.userAddresses
      this.userAddresses[index].members.splice(this.userAddresses[index].members.indexOf(member), 1)
      db.collection('addresses').doc(localUserAddresses[index].address).set(this.userAddresses[index])

      // Removes the user in the members array of the address.
      db.collection('users').doc(member.uid).get()
        .then(function (doc) {
          if (doc.exists) {
            const memberData = doc.data()
            for (let a = 0; a < memberData.addresses.length; a++) {
              if (localUserAddresses[index].address === memberData.addresses[a].address) {
                memberData.addresses.splice(a, 1)
              }
            }
            // Saves the array with removed data to the user's document.
            db.collection('users').doc(member.uid).set(memberData)
              .then(function () {
                console.log("Address successfully removed in member's documents!")
              })
              .catch(function (error) {
                console.error('Error writing document: ', error)
              })
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document.')
          }
        }).catch(function (error) {
          console.log('Error getting document:', error)
        })
    },
    addPlace () {
      if (this.newPlace !== '') {
        this.$store.commit('addPlace', this.newPlace)
        this.newPlace = ''
        document.getElementById('newPlace').focus()
      } else {
        alert('Add a place first.')
      }
    },
    addFilter () {
      if (this.newFilter !== '') {
        this.$store.commit('addFilter', this.newFilter)
        this.newFilter = ''
        document.getElementById('newFilter').focus()
      } else {
        alert('Add a filter first.')
      }
    },
    updatePassword () {
      const user = firebase.auth().currentUser
      if (this.checkPassword === this.newPassword) {
        var newPassword = this.newPassword
      } else {
        alert('The new password cannot be empty.')
      }
      user.updatePassword(newPassword)
        .then(function () {
          // Update successful.
          console.log('A new password is set.')
        })
        .catch(function (error) {
          // An error happened.
          console.log(error.message)
        })
      this.oldPassword = ''
      this.newPassword = ''
      this.checkPassword = ''
    },
    updateEmail () {
      const user = firebase.auth().currentUser
      db.collection('users').doc(user.uid).update({
        'info.email': this.userEmail
      })
        .then(function () {
          console.log('1/2 email successfully updated!')
        })
        .catch(function (error) {
          console.log('Error: ', error)
        })
      user.updateEmail(this.userEmail)
        .then(function () {
          // Update successful.
          console.log('2/2 email successfully updated!')
        })
        .catch(function (error) {
          // An error happened.
          console.log('Error: ', error)
          // Prompt the user to re-provide their sign-in credentials
          var password = prompt('Please reauthenticate before we can update your email.', 'Password')
          const credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            password
          )
          user.reauthenticateAndRetrieveDataWithCredential(credential)
            .then(function () {
              // User re-authenticated.
              user.updateEmail(this.userEmail)
                .then(function () {
                  // Update successful.
                  console.log('2/2 email successfully updated!')
                })
                .catch(function (error) {
                  console.log('There is still an error occuring.', error)
                })
            })
            .catch(function (error) {
              // An error happened.
              console.log('Error: ', error)
            })
        })
    },
    deleteAccount () {
      if (this.deleteConfirmation === 'YES') {
        this.$store.commit('setAuthFlag')
        const user = firebase.auth().currentUser
        const obj = JSON.parse(JSON.stringify(user))
        const collectionRef = db.collection('users').doc(obj.uid).collection('calendar')
        collectionRef.get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              // deletes all the documents in collection calendar
              collectionRef.doc(doc.id).delete()
                .then(function () {
                  console.log('Calendar document successfully deleted.')
                })
                .catch(function (error) {
                  console.error('Error removing document: ', error)
                })
            })
          })
        // deletes the user account in firebase authentication
        user.delete()
          .then(function () {
            console.log('Changed router to register')
            // User deleted.
          }).catch(function (error) {
            // An error happened.
            console.log(error.message)
          })
        // deletes the user data in the main document
        db.collection('users').doc(obj.uid).delete()
          .then(function () {
            console.log('User data successfully deleted.')
          })
          .catch(function (error) {
            console.error('Error removing document: ', error)
          })
        this.$router.push('register')
      } else {
        alert('Please enter YES before deleting your account.')
      }
    }
  }
}
</script>

<style lang="css" scoped>
@keyframes slideInUp {
  from {
    top: 400px;
    opacity: 0;
  }
  to {
    top: 210px;
    opacity: 1;
  }
}
.animated {
  animation: fadeIn .8s;
}
.box {
  margin: auto;
  font-size: 20px;
  padding: 5px;
  width: 30px;
  height: 25px;
  margin-bottom: 30px;
  margin-top: 100px;
  position: relative;
  text-align: center;
  border: 2px solid black;
}
.sign {
  position: absolute;
  top: 50%;
  margin-top: -19px;
  left: 50%;
  margin-left: -7px;
  font-size: 30px;
  transition: .8s ease-in-out;
}
.sign_special {
  margin-top: 0px;
  font-size: 20px;
  transition: .8s ease-in-out;
}
.past {
  position: relative;
  top: -43px;
  left: 50%;
  width: 53px;
  border: 1px solid black;
  transform: rotate(-40.5deg) translateX(-65%);
}
.dayname {
  font-size: 20px;
  margin-top: 30px;
  margin-bottom: 50px;
}
.block_date {
  display: block;
}
.purchase_button {
  position: relative;
  display: inline-block;
  margin-top: -20px;
  font-size: .714em;
  border: 1.2px solid black;
  border-radius: 20px 20px;
  padding: 5px 10px 5px 10px;
}
.purchase_button:active {
  transition: 0s;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.4);
}
.container {
  position: relative;
  top: 210px;
  text-align: center;
  animation: slideInUp .8s;
  animation-delay: .4s;
  animation-fill-mode: forwards;
  opacity: 0;
}
.ingredients_break {
  position: relative;
  top: auto;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: auto;
  margin-top: -10px;
  margin-bottom: 35px;
  border: 0px;
  border-bottom-style: solid;
  border-bottom-color: black;
  border-bottom-width: 1px;
}
.inline_date {
  display: inline-block;
  margin: 7px;
  width: 25px;
  font-weight: 400;
  border: 1.4px solid white;
  border-radius: 20px 20px;
  padding-left: 7px;
  padding-right: 7px;
}
.inline_date_bought {
    background: linear-gradient(315deg, #ffdeb9, lightpink 100%);
    color: white;
    padding: auto 5px auto 5px;
    border-radius: 20px 20px;
}
.inline_date_selected {
  font-weight: 400;
  border: 1.4px solid black;
  border-radius: 20px 20px;
}
input[type=text].amount,
input[type=password].amount {
  border: 0px;
  border-bottom-style: solid;
  border-bottom-color: black;
  border-bottom-width: 1px;
  display: block;
  width: 120px;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 5px;
  font-size: 14px;
  font-family: Montserrat;
}
input[type=text]:focus.amount,
input[type=password]:focus.amount  {
  border: 0px;
  border-bottom-style: solid;
  border-bottom-color: black;
  border-bottom-width: 2px;
  display: block;
  width: 120px;
  position: relative;
  outline: none;
}
label {
  position: relative;
  display: block;
  text-align: left;
  top: 36px;
  width: 100px;
  left: 50%;
  transform: translateX(-60px);
  font-size: 10px;
}
.year_date {
  font-weight: 500;
}
.price {
  margin-top: 40px;
  background: linear-gradient(315deg, #ffdeb9, lightpink 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
@media (min-width: 1000px) {
  .container {
    top: 240px;
  }
  .day {
    display: inline-block;
    width: calc(100%/9);
    vertical-align: top;
  }
}
@media (hover:hover) {
  .purchase_button:hover .purchase_text {
    color: white;
    transition: .4s ease-in-out;
  }
  .purchase_button:hover {
    background: linear-gradient(315deg, #ffdeb9, lightpink 100%);
    border: 1.2px solid #ffc0b8;
    cursor: pointer;
    transition: .4s ease-in-out;
  }
  .inline_date:hover {
    cursor: pointer;
  }
  .box:hover {
    cursor: pointer;
  }
  .box:hover .sign {
    transform: rotate(270deg);
  }
}
</style>
