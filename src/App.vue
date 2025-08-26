<script setup lang="ts">
import { OdkWebForm } from '@getodk/web-forms';
import { ref } from 'vue';

import allQuestionTypes from '../public/xml-forms/all-question-types.xml?raw';
/*import dateQuestionType from '../public/xml-forms/date.xml?raw';
import flatGroups from '../public/xml-forms/7-readonly-group.xml?raw';
import nestedGroups from '../public/xml-forms/nested-groups.xml?raw';
import nestedRepeats from '../public/xml-forms/nested-repeat.xml?raw';*/
import stringWidgets from '../public/xml-forms/string-widgets.xml?raw';
import thousandsSeparator from '../public/xml-forms/thousands-separator.xml?raw';

const formXml = ref<string | null>(null);

// @ts-ignore
const fetchAttachment = async (attachment) => {
  const response = await fetch('/xml-forms' + attachment.pathname);
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
      <li @click="formXml = allQuestionTypes"><a style="margin: 20px; cursor: pointer; color: dodgerblue; text-decoration: underline;">All Question Types</a></li>
      <li @click="formXml = thousandsSeparator"><a style="margin: 20px; cursor: pointer; color: dodgerblue; text-decoration: underline;">Thousands Separator</a></li>
      <li @click="formXml = stringWidgets"><a style="margin: 20px; cursor: pointer; color: dodgerblue; text-decoration: underline;">String Widgets</a></li>
      <!--
      <li @click="formXml = dateQuestionType"><a style="margin: 20px; cursor: pointer; color: dodgerblue; text-decoration: underline;">Date question type</a></li>
      <li @click="formXml = flatGroups"><a style="margin: 20px; cursor: pointer; color: dodgerblue; text-decoration: underline;">Groups - no nested</a></li>
      <li @click="formXml = nestedGroups"><a style="margin: 20px; cursor: pointer; color: dodgerblue; text-decoration: underline;">Groups - nested</a></li>
      <li @click="formXml = nestedRepeats"><a style="margin: 20px; cursor: pointer; color: dodgerblue; text-decoration: underline;">Repeats - nested</a></li>
      -->
    </ul>
  </template>

  <template v-if="formXml != null">
    <div style="background: black; color: white; padding: 10px; font-size: 10px;">
      <span>Blank Project - Web Forms Plugin</span>
      <a @click="formXml = null" style="margin-left: 40px; cursor: pointer;"><b>Click here to select another form</b></a>
    </div>

    <OdkWebForm
        :form-xml="formXml"
        :fetch-form-attachment="fetchAttachment"
        :submission-max-size="5242880"
        @submit="handleSubmit"
        @submit-chunked="handleChunkedSubmit"
    />
  </template>

</template>

<style scoped>

</style>
