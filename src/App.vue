<script setup lang="ts">
import { OdkWebForm } from '@getodk/web-forms';
import { ref } from 'vue';

const xmlModules = import.meta.glob('../public/xforms/**/*.xml', { as: 'raw' });

const forms = Object.keys(xmlModules).map((path) => {
  const parts = path.split('/');
  const dir = parts[parts.length - 2];
  return { path, dir, name: dir };
}).sort((a, b) => a.name.localeCompare(b.name));

const formXml = ref<string | null>(null);
const currentFormDir = ref<string>('');

const selectForm = async (form: { path: string; dir: string; name: string }) => {
  const module = await xmlModules[form.path]();
  formXml.value = module;
  currentFormDir.value = form.dir;
};

// @ts-ignore
const fetchAttachment = async (attachment) => {
  // Assuming attachment.pathname is relative (e.g., 'asset.jpg'), prepend with form dir
  const assetPath = `/xforms/${currentFormDir.value}/${attachment.pathname}`;
  const response = await fetch(assetPath);
  const contentType = response.headers.get('content-type');

  const fetchHeaders = new Headers();
  if (contentType) {
    fetchHeaders.append('content-type', contentType);
  }

  let newBody;
  try {
    newBody = await response.blob();
  } catch (e) {
    console.error('body ::', e);
  }

  return new Response(newBody, {
    status: response.status,
    statusText: response.statusText,
    headers: fetchHeaders,
  });
};

// @ts-ignore
const readXmlFile = (file) => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};

const handleSubmit = async (data: any) => {
  console.warn('handleSubmit payload: ', data);
  if (data && data.data?.length) {
    const xmlString = await readXmlFile(data.data[0]?.instanceFile);
    console.warn('handleSubmit XML submission: ', xmlString);
  }
};

const handleChunkedSubmit = async (data: any) => {
  console.warn('handleChunkedSubmit payload: ', data);
  if (data && data.data?.length) {
    const xmlString = await readXmlFile(data.data[0].instanceFile);
    console.warn('handleChunkedSubmit XML submission: ', xmlString);
  }
};
</script>

<template>
  <template v-if="formXml == null">
    <h1>Blank Project - Web Forms Plugin</h1>
    <p>Choose a form from below:</p>
    <ul>
      <li
          v-for="form in forms"
          :key="form.path"
          @click="selectForm(form)"
          style="margin: 20px 20px 40px 20px;"
      >
        <a style="margin: 20px 20px 20px 20px; cursor: pointer; color: dodgerblue; text-decoration: underline;">
          {{ form.name }}
        </a>
      </li>
    </ul>
  </template>

  <template v-if="formXml != null">
    <OdkWebForm
        :form-xml="formXml"
        :fetch-form-attachment="fetchAttachment"
        :submission-max-size="5242880"
        @submit="handleSubmit"
        @submit-chunked="handleChunkedSubmit"
    />

    <div style="background: black; color: white; padding: 10px; font-size: 10px;">
      <span>Blank Project - Web Forms Plugin</span>
      <a @click="formXml = null" style="margin-left: 40px; cursor: pointer;"><b>Click here to select another form</b></a>
    </div>
  </template>
</template>

<style scoped>

</style>
