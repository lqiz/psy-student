<template>
  <el-footer class="footer-container">
    <div class="footer">
      <div class="line">
        <span class="link pc">
          © 北京大学医学部 北京市海淀区学院路38号 邮编：100191
        </span>
        <span class="link mb"> © 北京大学医学部 北京市海淀区学院路38号 </span>
      </div>
      <div class="line mb">
        <span class="link"> 邮编：100191 </span>
        <span class="link">
          <img src="@/assets/images/v2.png" alt="" srcset="" />
          <el-link
            :underline="false"
            type="info"
            href="https://beian.miit.gov.cn/"
          >
            京 ICP 备 05065075号-19
          </el-link>
        </span>
      </div>
      <div class="line">
        <span class="link pc">
          <img src="@/assets/images/v2.png" alt="" srcset="" />
          <el-link
            :underline="false"
            type="info"
            href="https://beian.miit.gov.cn/"
          >
            京 ICP 备 05065075号-19
          </el-link>
        </span>
        <span class="link">
          <el-link
            type="info"
            href="https://opypw1kivl.feishu.cn/docx/HR6PdM7qGoywyxxMRXicDKoRnIg"
            target="_blank"
            :underline="false"
            >使用说明</el-link
          >
        </span>
        <span class="link">
          <ConsultationButton />
        </span>
      </div>
    </div>
  </el-footer>
</template>

<script setup>
import ConsultationButton from './ConsultationButton.vue';
</script>

<style lang="scss" scoped>
@import '@/style/variable.scss';
@import '@/style/mixin.scss';

.footer-container {
  background-color: var(--main-color);
  height: $footerHeight;
}
.footer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #fff;
  font-size: 14px;
  .line {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .link {
    display: flex;
    align-items: center;
    text-align: center;
    .el-link {
      color: #fff;
    }
    img {
      width: 18px;
      height: 18px;
      margin-right: 5px;
    }
    &:not(:last-child)::after {
      content: '  ·  ';
      display: inline-block;
      white-space: pre;
    }
  }
  @include fullContent {
    .footer .line:first-child  .link {
      &.pc::after {
        display: none;
      }
    }
    .link {
      padding: 5px 0;
      
    }

    .mb {
      display: none;
    }
  }
  @include smallContent {
    .link {
      padding: 1px 0;
    }
    .pc {
      display: none;
    }
  }
}
</style>
