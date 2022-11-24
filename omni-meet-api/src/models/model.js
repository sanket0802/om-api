import mongoose from 'mongoose'
import UserSchema from '../models/user'
import RoomSchema from '../models/room'
import TenantSchema from '../models/tenant'
import PlanSchema from '../models/plan'
import RoleSchema from '../models/role'
import TenantPlanMappingSchema from '../models/tenant_plan_mapping'
import MeetingSchema from '../models/meeting'
import _ from 'lodash'
const models = {
    User    : mongoose.model('User', UserSchema),
    Room    : mongoose.model('Room',RoomSchema),
    Tenant    : mongoose.model('Tenant', TenantSchema),
    Plan    : mongoose.model('Plan', PlanSchema),
    Role    : mongoose.model('Role', RoleSchema),
    TenantPlanMapping    : mongoose.model('Tenant_Plan_Mapping', TenantPlanMappingSchema),
    Meeting: mongoose.model('Meeting',MeetingSchema)
  }

Object.values(models).forEach(model => {
    model.createCollection()
  })

module.exports = {
    User              : models.User,
    Room              : models.Room,
    Tenant            : models.Tenant,
    Plan              : models.Plan,
    Role              : models.Role,
    TenantPlanMapping : models.TenantPlanMapping,
    Meeting           : models.Meeting
}