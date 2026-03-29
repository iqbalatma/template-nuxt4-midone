<script lang="ts" setup>
import fakers from '@/utils/faker'
import { AvatarRoot, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Lucide } from '@/components/ui/lucide'
import {
  MenuRoot,
  MenuTrigger,
  MenuPositioner,
  MenuContent,
  MenuItem,
  MenuSeparator,
} from '@/components/ui/menu'
</script>

<template>
  <div class="flex items-center">
    <h2 class="mr-auto text-lg font-medium">Change Password</h2>
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
      <!-- BEGIN: Change Password -->
      <Box class="p-0 lg:mt-5">
        <div class="flex items-center border-b border-foreground/15 p-5">
          <h2 class="mr-auto text-base font-medium">Change Password</h2>
        </div>
        <div class="p-5">
          <FieldGroup>
            <FieldGroup>
              <Field>
                <FieldLabel>Old Password</FieldLabel>
                <Input placeholder="Old Password" required />
              </Field>
              <Field>
                <FieldLabel>New Password</FieldLabel>
                <Input placeholder="New Password" required />
              </Field>
              <Field>
                <FieldLabel>Confirm New Password</FieldLabel>
                <Input placeholder="Confirm New Password" required />
              </Field>
            </FieldGroup>
            <Field orientation="horizontal">
              <Button type="submit">Change Password</Button>
              <Button look="outline">Reset</Button>
            </Field>
          </FieldGroup>
        </div>
      </Box>
      <!-- END: Change Password -->
    </div>
  </div>
</template>
