<script setup>
import { onMounted, reactive, ref } from 'vue'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const auth = useAuthStore()
const toast = useToast()
const saving = ref(false)
const twoFactorSaving = ref(false)
const twoFactorEnabled = ref(false)
const twoFactorPassword = ref('')
const recoveryCodes = ref([])
const errors = ref([])

const form = reactive({
  first_name: '',
  last_name: '',
  gender: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipcode: '',
  country: '',
})

onMounted(async () => {
  if (!auth.user) await auth.init()
  if (auth.user) {
    twoFactorEnabled.value = Boolean(auth.user.two_factor_enabled)
    for (const field of Object.keys(form)) {
      form[field] = auth.user[field] ?? ''
    }
  }
})

const updateTwoFactor = async () => {
  errors.value = []
  twoFactorSaving.value = true

  try {
    const response = await api.put('/User/two-factor', {
      enabled: !twoFactorEnabled.value,
      password: twoFactorPassword.value,
    })
    auth.user = response.data.user
    twoFactorEnabled.value = Boolean(response.data.user.two_factor_enabled)
    recoveryCodes.value = response.data.recovery_codes ?? []
    twoFactorPassword.value = ''
    toast.success(response.data.message)
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = Object.values(error.response.data.errors).flat()
    } else if (error.response?.data?.message) {
      errors.value = [error.response.data.message]
    } else {
      errors.value = ['Unable to update two-factor settings. Please try again.']
    }
  } finally {
    twoFactorSaving.value = false
  }
}

const saveProfile = async () => {
  errors.value = []
  saving.value = true

  try {
    const response = await api.put('/User/profile', form)
    auth.user = response.data.user
    toast.success('Profile saved.')
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = Object.values(error.response.data.errors).flat()
    } else if (error.response?.data?.message) {
      errors.value = [error.response.data.message]
    } else {
      errors.value = ['Unable to save your profile. Please try again.']
    }
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="min-h-screen bg-gray-50 px-4 py-12 text-gray-900">
    <div class="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm sm:p-10">
      <div class="mb-8 border-b border-gray-100 pb-5">
        <p class="text-xs font-semibold uppercase tracking-widest text-blue-600">Your account</p>
        <h1 class="mt-2 text-3xl font-semibold">Profile</h1>
        <p class="mt-2 text-sm text-gray-500">Add your contact and delivery details for checkout.</p>
      </div>

      <div v-if="!auth.user" class="text-sm text-gray-600">
        Sign in to view your profile.
      </div>

      <form v-else class="space-y-6" @submit.prevent="saveProfile">
        <div>
          <label for="profile-email" class="mb-2 block text-sm font-medium">Email</label>
          <input
            id="profile-email"
            :value="auth.user.email"
            type="email"
            disabled
            class="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500"
          />
          <p class="mt-1 text-xs text-gray-500">Email changes are not available from this profile form.</p>
        </div>

        <ul v-if="errors.length" class="space-y-1 rounded-lg bg-red-50 p-4 text-sm text-red-700" role="alert">
          <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
        </ul>

        <section class="rounded-xl border border-gray-200 p-5">
          <h2 class="text-base font-semibold">Email two-factor authentication</h2>
          <p class="mt-1 text-sm text-gray-600">
            Add a one-time code sent to your verified email address when signing in. Email codes are helpful but are not phishing-resistant.
          </p>
          <p class="mt-3 text-sm font-medium" :class="twoFactorEnabled ? 'text-emerald-700' : 'text-gray-600'">
            {{ twoFactorEnabled ? 'Enabled' : 'Disabled' }}
          </p>
          <div v-if="recoveryCodes.length" class="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4">
            <p class="text-sm font-semibold text-amber-900">Save these recovery codes now</p>
            <p class="mt-1 text-xs text-amber-800">Each code works once if you cannot access your email. They will not be shown again.</p>
            <ul class="mt-3 grid grid-cols-2 gap-2 font-mono text-sm text-amber-950">
              <li v-for="code in recoveryCodes" :key="code">{{ code }}</li>
            </ul>
          </div>
          <div class="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              v-model="twoFactorPassword"
              type="password"
              autocomplete="current-password"
              aria-label="Confirm your password to update two-factor authentication"
              placeholder="Confirm your password"
              class="profile-input sm:max-w-xs"
            />
            <button
              type="button"
              :disabled="twoFactorSaving || !twoFactorPassword"
              class="rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              @click="updateTwoFactor"
            >
              {{ twoFactorSaving ? 'Updating…' : twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA' }}
            </button>
          </div>
        </section>

        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label for="profile-first-name" class="mb-2 block text-sm font-medium">First name</label>
            <input id="profile-first-name" v-model.trim="form.first_name" required maxlength="255" autocomplete="given-name" class="profile-input" />
          </div>
          <div>
            <label for="profile-last-name" class="mb-2 block text-sm font-medium">Last name</label>
            <input id="profile-last-name" v-model.trim="form.last_name" required maxlength="255" autocomplete="family-name" class="profile-input" />
          </div>
          <div>
            <label for="profile-gender" class="mb-2 block text-sm font-medium">Gender <span class="text-gray-400">(optional)</span></label>
            <input id="profile-gender" v-model.trim="form.gender" maxlength="255" class="profile-input" />
          </div>
          <div>
            <label for="profile-phone" class="mb-2 block text-sm font-medium">Phone number</label>
            <input id="profile-phone" v-model.trim="form.phone" required minlength="11" maxlength="255" autocomplete="tel" class="profile-input" />
          </div>
          <div class="sm:col-span-2">
            <label for="profile-address" class="mb-2 block text-sm font-medium">Street address</label>
            <input id="profile-address" v-model.trim="form.address" required maxlength="255" autocomplete="street-address" class="profile-input" />
          </div>
          <div>
            <label for="profile-city" class="mb-2 block text-sm font-medium">City</label>
            <input id="profile-city" v-model.trim="form.city" required maxlength="255" autocomplete="address-level2" class="profile-input" />
          </div>
          <div>
            <label for="profile-state" class="mb-2 block text-sm font-medium">State / region</label>
            <input id="profile-state" v-model.trim="form.state" required maxlength="255" autocomplete="address-level1" class="profile-input" />
          </div>
          <div>
            <label for="profile-zipcode" class="mb-2 block text-sm font-medium">Postal code</label>
            <input id="profile-zipcode" v-model.trim="form.zipcode" required maxlength="255" autocomplete="postal-code" class="profile-input" />
          </div>
          <div>
            <label for="profile-country" class="mb-2 block text-sm font-medium">Country</label>
            <input id="profile-country" v-model.trim="form.country" required maxlength="255" autocomplete="country-name" class="profile-input" />
          </div>
        </div>

        <button
          type="submit"
          :disabled="saving"
          class="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ saving ? 'Saving…' : 'Save profile' }}
        </button>
      </form>
    </div>
  </section>
</template>

<style scoped>
.profile-input {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
}

.profile-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px #3b82f6;
}
</style>
