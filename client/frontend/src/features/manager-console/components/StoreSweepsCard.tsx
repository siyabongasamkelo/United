// 📂 File: src/features/manager-console/components/StoreSweepsCard.tsx
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Divider,
} from "@mui/material";
import { Storefront } from "@mui/icons-material";

interface StoreVisit {
  id: string;
  storeName: string;
  visitsCount: number;
}

interface StoreSweepsCardProps {
  storeVisits?: StoreVisit[];
}

export function StoreSweepsCard({ storeVisits = [] }: StoreSweepsCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{ borderRadius: 3, borderColor: "#cbd5e1", height: "100%" }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Storefront sx={{ color: "#0284c7", fontSize: 20 }} />
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: "900", color: "#1e1b4b" }}
          >
            Anchor Store Sweeps (Today)
          </Typography>
        </Box>

        {storeVisits.length === 0 ? (
          <Typography
            variant="caption"
            sx={{
              color: "#64748b",
              display: "block",
              py: 2,
              fontStyle: "italic",
            }}
          >
            No anchor sweeps submitted yet today.
          </Typography>
        ) : (
          <List disablePadding>
            {storeVisits.map((store) => (
              <Box key={store.id}>
                <ListItem
                  sx={{
                    px: 0,
                    py: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "700", color: "#334155" }}
                  >
                    {store.storeName}
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: "#e0f2fe",
                      color: "#0369a1",
                      fontWeight: "800",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1.5,
                      fontSize: "0.75rem",
                    }}
                  >
                    {store.visitsCount} audits
                  </Box>
                </ListItem>
                <Divider sx={{ borderColor: "#f1f5f9" }} />
              </Box>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
