<script lang="ts" setup>
import fakers from '@/utils/faker'
import { Button } from '@/base/ui/button'
import { Badge } from '@/base/ui/badge'
import { Input } from '@/base/ui/input'
import { Textarea } from '@/base/ui/textarea'
import { Box } from '@/base/ui/box'
import {
  MenuRoot,
  MenuTrigger,
  MenuPositioner,
  MenuContent,
  MenuItem,
  MenuSeparator,
} from '@/base/ui/menu'
import { Field, FieldGroup, FieldLabel } from '@/base/ui/field'
import { NativeSelect, NativeSelectOption } from '@/base/ui/native-select'
import { AvatarRoot, AvatarFallback, AvatarImage } from '@/base/ui/avatar'
import {
  TooltipRoot,
  TooltipTrigger,
  TooltipPositioner,
  TooltipContent,
} from '@/base/ui/tooltip'
import { Lucide } from '@/base/ui/lucide'
</script>

<template>
  <div class="flex items-center">
    <h2 class="mr-auto text-lg font-medium">Update Profile</h2>
  </div>
  <div class="grid grid-cols-12 gap-6">
    <!-- BEGIN: Profile Menu -->
    <div class="col-span-12 flex flex-col-reverse lg:col-span-4 lg:block 2xl:col-span-3">
      <Box class="mt-5 p-0">
        <div class="relative flex items-center p-5">
          <AvatarRoot class="size-12 rounded-full">
            <AvatarFallback>PA</AvatarFallback>
            <AvatarImage :src="fakers[0]!['photos'][0]" alt="avatar" />
          </AvatarRoot>
          <div class="ml-4 mr-auto">
            <div class="text-base font-medium">
              {{ fakers[0]!['users'][0]!['name'] }}
            </div>
            <div class="opacity-70">{{ fakers[0]!['jobs'][0] }}</div>
          </div>
          <MenuRoot
            class="w-auto"
            :positioning="{
              placement: 'bottom',
            }"
          >
            <MenuTrigger as-child>
              <Lucide class="size-5 opacity-70" icon="MoreHorizontal" />
            </MenuTrigger>
            <MenuPositioner>
              <MenuContent class="w-64">
                <div class="font-medium">Export Options</div>
                <MenuSeparator />
                <MenuItem value="0">
                  <Lucide icon="Activity" />
                  English
                </MenuItem>
                <MenuItem value="1">
                  <Lucide icon="Box" />
                  Indonesia
                  <Badge variant="danger" look="outline" class="ml-auto">10</Badge>
                </MenuItem>
                <MenuItem value="2">
                  <Lucide icon="Layout" />
                  English
                </MenuItem>
                <MenuItem value="3">
                  <Lucide icon="Sidebar" />
                  Indonesia
                </MenuItem>
                <MenuSeparator />
                <div class="flex">
                  <Button class="text-xs" type="button" variant="primary" look="outline" size="sm">
                    Settings
                  </Button>
                  <Button
                    class="ml-auto text-xs"
                    type="button"
                    variant="secondary"
                    look="outline"
                    size="sm"
                  >
                    View Profile
                  </Button>
                </div>
              </MenuContent>
            </MenuPositioner>
          </MenuRoot>
        </div>
        <div class="flex flex-col gap-5 border-t border-foreground/10 p-5">
          <a
            class="[&.active]:text-primary active flex items-center [&.active]:font-medium"
            href=""
          >
            <Lucide class="mr-2 size-4" icon="Activity" /> Personal Information
          </a>
          <a class="[&.active]:text-primary flex items-center [&.active]:font-medium" href="">
            <Lucide class="mr-2 size-4" icon="Box" /> Account Settings
          </a>
          <a class="[&.active]:text-primary flex items-center [&.active]:font-medium" href="">
            <Lucide class="mr-2 size-4" icon="Lock" /> Change Password
          </a>
          <a class="[&.active]:text-primary flex items-center [&.active]:font-medium" href="">
            <Lucide class="mr-2 size-4" icon="Settings" /> User Settings
          </a>
        </div>
        <div class="flex flex-col gap-5 border-t border-foreground/10 p-5">
          <a class="flex items-center" href="">
            <Lucide class="mr-2 size-4" icon="Activity" /> Email Settings
          </a>
          <a class="[&.active]:text-primary flex items-center [&.active]:font-medium" href="">
            <Lucide class="mr-2 size-4" icon="Box" /> Saved Credit Cards
          </a>
          <a class="[&.active]:text-primary flex items-center [&.active]:font-medium" href="">
            <Lucide class="mr-2 size-4" icon="Lock" /> Social Networks
          </a>
          <a class="[&.active]:text-primary flex items-center [&.active]:font-medium" href="">
            <Lucide class="mr-2 size-4" icon="Settings" /> Tax Information
          </a>
        </div>
        <div class="flex border-t border-foreground/10 p-5">
          <Button
            size="sm"
            variant="ghost"
            class="shadow-none border border-foreground/15"
            type="button"
          >
            New Group
          </Button>
          <Button
            size="sm"
            variant="ghost"
            class="shadow-none border border-foreground/15 ml-auto"
            type="button"
          >
            New Quick Link
          </Button>
        </div>
      </Box>
    </div>
    <!-- END: Profile Menu -->
    <div class="col-span-12 lg:col-span-8 2xl:col-span-9">
      <!-- BEGIN: Display Information -->
      <Box class="p-0 lg:mt-5">
        <div class="flex items-center border-b border-foreground/15 p-5">
          <h2 class="mr-auto text-base font-medium">Display Information</h2>
        </div>
        <div class="p-5">
          <div class="flex flex-col xl:flex-row">
            <div class="mt-6 flex-1 xl:mt-0">
              <FieldGroup>
                <div class="grid grid-cols-12 gap-x-5">
                  <div class="col-span-12 2xl:col-span-6">
                    <Field>
                      <FieldLabel for="update-profile-form-1">Display Name</FieldLabel>
                      <Input
                        id="update-profile-form-1"
                        type="text"
                        :value="fakers[0]!['users'][0]!['name']"
                        placeholder="Input text"
                        disabled
                      />
                    </Field>
                    <Field class="mt-3">
                      <FieldLabel for="update-profile-form-2">Nearest MRT Station</FieldLabel>
                      <NativeSelect class="w-full" id="update-profile-form-2">
                        <NativeSelectOption value="1">Admiralty</NativeSelectOption>
                        <NativeSelectOption value="2">Aljunied</NativeSelectOption>
                        <NativeSelectOption value="3">Ang Mo Kio</NativeSelectOption>
                        <NativeSelectOption value="4">Bartley</NativeSelectOption>
                        <NativeSelectOption value="5">Beauty World</NativeSelectOption>
                      </NativeSelect>
                    </Field>
                  </div>
                  <div class="col-span-12 2xl:col-span-6">
                    <Field class="mt-3 2xl:mt-0">
                      <FieldLabel for="update-profile-form-3">Postal Code</FieldLabel>
                      <NativeSelect class="w-full" id="update-profile-form-3">
                        <NativeSelectOption value="1"
                          >018906 - 1 STRAITS BOULEVARD SINGA...</NativeSelectOption
                        >
                        <NativeSelectOption value="2"
                          >018910 - 5A MARINA GARDENS DRIVE...</NativeSelectOption
                        >
                        <NativeSelectOption value="3"
                          >018915 - 100A CENTRAL BOULEVARD...</NativeSelectOption
                        >
                        <NativeSelectOption value="4"
                          >018925 - 21 PARK STREET MARINA...</NativeSelectOption
                        >
                        <NativeSelectOption value="5"
                          >018926 - 23 PARK STREET MARINA...</NativeSelectOption
                        >
                      </NativeSelect>
                    </Field>
                    <Field class="mt-3">
                      <FieldLabel for="update-profile-form-4">Phone Number</FieldLabel>
                      <Input
                        id="update-profile-form-4"
                        type="text"
                        value="65570828"
                        placeholder="Input text"
                      />
                    </Field>
                  </div>
                  <div class="col-span-12">
                    <Field class="mt-3">
                      <FieldLabel for="update-profile-form-5">Address</FieldLabel>
                      <Textarea
                        id="update-profile-form-5"
                        value="10 Anson Road, International Plaza, #10-11, 079903 Singapore, Singapore"
                        placeholder="Adress"
                      />
                    </Field>
                  </div>
                </div>
                <Button class="w-28" type="button" variant="primary"> Save </Button>
              </FieldGroup>
            </div>
            <div class="mx-auto w-52 xl:ml-6 xl:mr-0">
              <div class="rounded-xl border-2 border-dashed border-foreground/15 p-5">
                <div class="image-fit relative mx-auto h-40 cursor-pointer">
                  <img
                    class="rounded-xl"
                    :src="fakers[0]!['photos'][0]"
                    alt="Midone - Tailwind Admin Dashboard Template"
                  />
                  <TooltipRoot>
                    <TooltipTrigger as-child>
                      <div
                        class="bg-(--color)/80 border-(--color) text-medium absolute right-0 top-0 -mr-2 -mt-2 flex size-5 items-center justify-center rounded-full text-white [--color:var(--color-danger)]"
                      >
                        <Lucide class="h-4 w-4" icon="X" />
                      </div>
                    </TooltipTrigger>
                    <TooltipPositioner>
                      <TooltipContent>Remove this profile photo?</TooltipContent>
                    </TooltipPositioner>
                  </TooltipRoot>
                </div>
                <div class="relative mx-auto mt-3 cursor-pointer">
                  <Button class="w-full" type="button" variant="primary"> Change Photo </Button>
                  <Input class="absolute left-0 top-0 h-full w-full opacity-0" type="file" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>
      <!-- END: Display Information -->
      <!-- BEGIN: Personal Information -->
      <Box class="mt-8 p-0">
        <div class="flex items-center border-b border-foreground/15 p-5">
          <h2 class="mr-auto text-base font-medium">Personal Information</h2>
        </div>
        <div class="p-5">
          <FieldGroup>
            <div class="grid grid-cols-12 gap-x-5">
              <div class="col-span-12 xl:col-span-6">
                <Field>
                  <FieldLabel for="update-profile-form-6">Email</FieldLabel>
                  <Input
                    id="update-profile-form-6"
                    type="text"
                    :value="fakers[0]!['users'][0]!['email']"
                    placeholder="Input text"
                    disabled
                  />
                </Field>
                <Field class="mt-3">
                  <FieldLabel for="update-profile-form-7">Name</FieldLabel>
                  <Input
                    id="update-profile-form-7"
                    type="text"
                    :value="fakers[0]!['users'][0]!['name']"
                    placeholder="Input text"
                    disabled
                  />
                </Field>
                <Field class="mt-3">
                  <FieldLabel for="update-profile-form-8">ID Type</FieldLabel>
                  <NativeSelect id="update-profile-form-8">
                    <NativeSelectOption>IC</NativeSelectOption>
                    <NativeSelectOption>FIN</NativeSelectOption>
                    <NativeSelectOption>Passport</NativeSelectOption>
                  </NativeSelect>
                </Field>
                <Field class="mt-3">
                  <FieldLabel for="update-profile-form-9">ID Number</FieldLabel>
                  <Input
                    id="update-profile-form-9"
                    type="text"
                    value="357821204950001"
                    placeholder="Input text"
                  />
                </Field>
              </div>
              <div class="col-span-12 xl:col-span-6">
                <Field class="mt-3 xl:mt-0">
                  <FieldLabel for="update-profile-form-10">Phone Number</FieldLabel>
                  <Input
                    id="update-profile-form-10"
                    type="text"
                    value="65570828"
                    placeholder="Input text"
                  />
                </Field>
                <Field class="mt-3">
                  <FieldLabel for="update-profile-form-11">Address</FieldLabel>
                  <Input
                    id="update-profile-form-11"
                    type="text"
                    value="10 Anson Road, International Plaza, #10-11, 079903 Singapore, Singapore"
                    placeholder="Input text"
                  />
                </Field>
                <Field class="mt-3">
                  <FieldLabel for="update-profile-form-12">Bank Name</FieldLabel>
                  <NativeSelect class="w-full" id="update-profile-form-12">
                    <NativeSelectOption value="1">SBI - STATE BANK OF INDIA</NativeSelectOption>
                    <NativeSelectOption value="2">CITI BANK - CITI BANK</NativeSelectOption>
                  </NativeSelect>
                </Field>
                <Field class="mt-3">
                  <FieldLabel for="update-profile-form-13">Bank Account</FieldLabel>
                  <Input
                    id="update-profile-form-13"
                    type="text"
                    value="DBS Current 011-903573-0"
                    placeholder="Input text"
                  />
                </Field>
              </div>
            </div>
            <div class="flex justify-end">
              <Button class="mr-auto w-28" type="button" variant="primary"> Save </Button>
              <Button type="button" variant="danger" look="outline">
                <Lucide class="mr-1 size-4" icon="Trash" /> Delete Account
              </Button>
            </div>
          </FieldGroup>
        </div>
      </Box>
      <!-- END: Personal Information -->
    </div>
  </div>
</template>
