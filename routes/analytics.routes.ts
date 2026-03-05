import express from 'express'
import { getTagsUsage } from '../controllers/getAnalytics.js'
import { tagUsagebyEntity } from '../controllers/getAnalytics.js'
import { tagUsageDays } from '../controllers/getAnalytics.js'

const router=express.Router()

//to get analytics
router.get('/tag-usage-count',getTagsUsage)
router.get('/tag-usage-by-entity',tagUsagebyEntity)
router.get('/top-tags-in-days',tagUsageDays)


export default router