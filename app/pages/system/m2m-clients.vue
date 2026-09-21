<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { Box } from '~/base/ui/box'
import { Badge } from '~/base/ui/badge'
import { Button } from '~/base/ui/button'
import { Lucide } from '~/base/ui/lucide'
import { TableBody, TableHeader, TableRow } from '~/base/ui/table'
import type { ModalDelete } from '#components'
import ModalFormM2MClient from '~/components/features/m2m-clients/ModalFormM2MClient.vue'
import ModalM2MClientSecret from '~/components/features/m2m-clients/ModalM2MClientSecret.vue'
import ModalRegenerateM2MClientSecret from '~/components/features/m2m-clients/ModalRegenerateM2MClientSecret.vue'
import { useM2MClientService } from '~/services/M2MClientService'
import { useAuthStore } from '~/stores/auth'
import { Permission } from '~/enums/Permission'
import type M2MClient from '~/types/entities/m2m_client'

definePageMeta({
  title: 'system.m2mClients.title',
  pageSubTitle: 'system.m2mClients.subtitle',
})

const { getAll, regenerateSecret, revokeById, clientsCollection, loading } = useM2MClientService()

const { hasPermission } = useAuthStore()
const canCreate = computed(() => hasPermission(Permission.M2MClientCreate))
const canUpdate = computed(() => hasPermission(Permission.M2MClientUpdate))
const canRevoke = computed(() => hasPermission(Permission.M2MClientDelete))

onMounted(getAll)

const searchKey = ref('')
const filteredClients = computed<M2MClient[]>(() => {
  const key = searchKey.value.trim().toLowerCase()
  if (key === '') return clientsCollection.value
  return clientsCollection.value.filter((client) => client.client.toLowerCase().includes(key))
})

const modalFormRef = useTemplateRef<InstanceType<typeof ModalFormM2MClient> | null>('modalFormRef')
const modalSecretRef = useTemplateRef<InstanceType<typeof ModalM2MClientSecret> | null>(
  'modalSecretRef',
)
const modalRegenerateRef = useTemplateRef<InstanceType<
  typeof ModalRegenerateM2MClientSecret
> | null>('modalRegenerateRef')
const modalRevokeRef = useTemplateRef<InstanceType<typeof ModalDelete> | null>('modalRevokeRef')
const selectedClientId = ref('')

// Both paths that mint a secret end here: it is shown once and never again, so
// the dialog opens before the list refresh rather than after.
const showSecret = (client: string, secret: string) => {
  modalSecretRef.value?.handleModal(true, { client, secret })
}

const onConfirmRegenerate = async (id: string) => {
  const created = await regenerateSecret(id)
  modalRegenerateRef.value?.handleModal(false)
  if (created) {
    showSecret(created.client, created.secret)
    await getAll()
  }
}

const onConfirmRevoke = async () => {
  if (await revokeById(selectedClientId.value)) await getAll()
}
</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <Box class="col-span-12 overflow-auto p-5 lg:overflow-visible">
      <div class="mb-4 flex items-center justify-between">
        <Button v-if="canCreate" variant="primary" @click="modalFormRef?.handleModal(true)">
          <Lucide icon="Plus" />
          {{ $t('system.m2mClients.add') }}
        </Button>
        <ClientSideFilter v-model="searchKey" class="ml-auto" />
      </div>

      <div v-if="loading" class="text-foreground/50 flex items-center justify-center gap-3 py-16">
        <Lucide icon="LoaderCircle" class="h-5 w-5 animate-spin" />
        <span class="text-sm">{{ $t('common.loading') }}</span>
      </div>

      <ClientSidePagination v-else :data="filteredClients" v-slot="{ data, start }">
        <TableHeader>
          <TableRow>
            <TH icon="Hash">{{ $t('common.no') }}</TH>
            <TH icon="Bot">{{ $t('system.m2mClients.columnClient') }}</TH>
            <TH icon="KeyRound">{{ $t('system.m2mClients.columnScope') }}</TH>
            <TH icon="Activity">{{ $t('common.status') }}</TH>
            <TH icon="Calendar">{{ $t('common.createdAt') }}</TH>
            <TH icon="Settings">{{ $t('common.actions') }}</TH>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(client, index) in data" :key="client.id">
            <TD>{{ start + index }}</TD>
            <TD>
              <p class="font-medium">{{ client.client }}</p>
              <!-- The id is the credential's X-Client-Id, so it is worth
                   showing: the display name above never authenticates. -->
              <SmallInfo class="font-mono">{{ client.id }}</SmallInfo>
            </TD>
            <TD>
              <div class="flex flex-wrap gap-1">
                <Badge
                  v-for="scope in client.scope"
                  :key="scope"
                  :variant="scope === '*' ? 'warning' : 'secondary'"
                  look="outline"
                  class="font-mono"
                >
                  {{ scope }}
                </Badge>
              </div>
            </TD>
            <TD>
              <Badge :variant="client.revoked_at ? 'danger' : 'success'" look="outline">
                <Lucide :icon="client.revoked_at ? 'Ban' : 'Check'" />
                {{
                  client.revoked_at
                    ? $t('system.m2mClients.revoked')
                    : $t('system.m2mClients.active')
                }}
              </Badge>
            </TD>
            <TD>{{ client.created_at }}</TD>
            <TD>
              <div class="flex items-center gap-2">
                <!-- A revoked client is terminal: the API refuses both a
                     rotation and a second revoke, so neither is offered. -->
                <ButtonEdit
                  v-if="canUpdate && !client.revoked_at"
                  @click-edit="modalFormRef?.handleModal(true, client)"
                />
                <Button
                  v-if="canUpdate && !client.revoked_at"
                  look="outline"
                  variant="ghost"
                  :title="$t('system.m2mClients.regenerate')"
                  @click="modalRegenerateRef?.handleModal(true, client)"
                >
                  <Lucide icon="RefreshCw" />
                </Button>
                <ButtonDelete
                  v-if="canRevoke && !client.revoked_at"
                  @click-delete="
                    () => {
                      selectedClientId = client.id
                      modalRevokeRef?.handleModal(true)
                    }
                  "
                />
              </div>
            </TD>
          </TableRow>
        </TableBody>
      </ClientSidePagination>
    </Box>
  </div>

  <ModalFormM2MClient
    ref="modalFormRef"
    @created="
      (created) => {
        showSecret(created.client, created.secret)
        getAll()
      }
    "
    @updated="getAll()"
  />
  <ModalM2MClientSecret ref="modalSecretRef" />
  <ModalRegenerateM2MClientSecret ref="modalRegenerateRef" @confirm="onConfirmRegenerate" />
  <ModalDelete
    ref="modalRevokeRef"
    :title="$t('system.m2mClients.revokeTitle')"
    :message="$t('system.m2mClients.revokeMessage')"
    @submit="onConfirmRevoke"
  />
</template>
