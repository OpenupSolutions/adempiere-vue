<template>
  <div class="user-profi">
    <router-link to="/profile/index">
      <el-row>
        <el-col :span="24" style="text-align: center;">
          <el-avatar shape="circle" :size="100" fit="fill" :src="avatarResize" />
          <br>
          <b> {{ userName }} </b>
          <br>
          <el-button round style="margin-top: 3%;"> {{ currentRole.name }} </el-button>
        </el-col>
      </el-row>
    </router-link>
    <roles-navbar />
  </div>
</template>

<script>
import RolesNavbar from '@/views/profile/components/RolesNavbar'
import { getImagePath } from '@/utils/ADempiere/resource.js'

export default {
  name: 'ProfilePreview',
  components: {
    RolesNavbar
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          roles: ''
        }
      }
    },
    avatar: {
      type: String,
      default: ''
    },
    fits: {
      type: Array,
      default: () => ['fill', 'contain', 'cover', 'none', 'scale-down']
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters['user/userInfo']
    },
    userName() {
      if (this.isEmptyValue(this.userInfo)) {
        return ''
      }
      return this.userInfo.name
    },
    currentRole() {
      return this.$store.getters['user/getRole']
    },
    avatarResize() {
      if (this.isEmptyValue(this.userInfo.image)) {
        return require('@/image/ADempiere/avatar/no-avatar.png')
      }

      const { uri } = getImagePath({
        file: this.userInfo.image,
        width: 40,
        height: 40
      })

      return uri
    }
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
