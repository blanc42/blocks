<script lang="ts">
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
  </script>
  
  <div class="flex items-center justify-center min-h-screen bg-background">
    <Card class="w-[350px]">
      <CardHeader>
        <CardTitle><slot name="title" /></CardTitle>
        <CardDescription><slot name="description" /></CardDescription>
      </CardHeader>
      <CardContent>
        <slot />
      </CardContent>
    </Card>
  </div>